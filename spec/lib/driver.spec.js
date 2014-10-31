'use strict';

var Cylon = require('cylon');

var Driver = source("driver");

describe("Cylon.Drivers.Mqtt", function() {
  var driver;

  beforeEach(function() {
    driver = new Driver({
      device: { connection: {} },
      extraParams: { topic: 'topic' }
    });
  });

  it("is a subclass of Cylon.Driver", function() {
    expect(driver).to.be.an.instanceOf(Driver);
    expect(driver).to.be.an.instanceOf(Cylon.Driver);
  });

  describe("#constructor", function() {
    it("sets @topic to the provided topic", function() {
      expect(driver.topic).to.be.eql("topic");
    });
  });

  describe("#start", function() {
    var callback, adaptor, device;

    beforeEach(function() {
      callback = spy();

      driver.device = device = { emit: spy() };
      driver.adaptor = adaptor = {
        subscribe: spy(),
        publish: spy(),
        on: stub()
      };

      driver.start(callback);
    });

    it("triggers the callback", function() {
      expect(callback).to.be.called;
    });

    it("subscribes to @topic", function() {
      expect(adaptor.subscribe).to.be.calledWith('topic');
    });

    describe("when the client receives a message", function() {
      context("if the topic matches the driver's", function() {
        beforeEach(function() {
          adaptor.on.yield('topic', 'message');
        });

        it("emits the event", function() {
          expect(device.emit).to.be.calledWith('message', 'message');
        });
      });

      context("if the topic doesn't match the drivers", function() {
        beforeEach(function() {
          adaptor.on.yield('not-topic', 'message');
        });

        it("does not emit the event", function() {
          expect(device.emit).to.not.be.called;
        });
      });
    });
  });

  describe("#halt", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      driver.halt(callback);
    });

    it("triggers the callback", function() {
      expect(callback).to.be.called;
    });
  });

  describe("#publish", function() {
    var adaptor;

    beforeEach(function() {
      driver.adaptor = adaptor = { publish: spy() };
      driver.publish('message');
    });

    it("publishes an event on the topic through the adaptor", function() {
      expect(adaptor.publish).to.be.calledWith('topic', 'message');
    });
  });
});