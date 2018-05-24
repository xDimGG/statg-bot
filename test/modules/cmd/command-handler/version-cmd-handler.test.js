const expect = require('chai').expect;
const sinon = require('sinon');

const logger = require('../../../../src/modules/log').getLogger();
const VersionCommandHandler = require('../../../../src/modules/cmd/command-handler/version-cmd-handler');

describe('VersionCommandHandler.handle()', () => {

    let debugStub = {};
    let infoStub = {};
    let warnStub = {};
    let errorStub = {};

    beforeEach(() => {

        // stub all log functions
        debugStub = sinon.stub(logger, "debug").callsFake((message) => {
            // do nothing
        });
        infoStub = sinon.stub(logger, "info").callsFake((message) => {
            // do nothing
        });
        warnStub = sinon.stub(logger, "warn").callsFake((message) => {
            // do nothing
        });
        errorStub = sinon.stub(logger, "error").callsFake((message) => {
            // do nothing
        });
    });

    afterEach(() => {
        
        debugStub.restore();
        infoStub.restore();
        warnStub.restore();
        errorStub.restore();
    });

    it('should send a message to the right channel', () => {

        const handler = VersionCommandHandler.getHandler();

        const cmd = {
            arguments: []
        };
        const bot = {
            sendMessage: function(params) {
                // do nothing
            }
        };
        const db = {};
        const pubg = {};

        let sendMessageSpy = sinon.spy(bot, 'sendMessage');

        cmd.discordUser = {};
        cmd.discordUser.channelId = '123';

        //cmd, bot, db, pubg
        handler.handle(cmd, bot, db, pubg);

        sinon.assert.calledOnce(sendMessageSpy);

        sendMessageSpy.restore();
    });

    it('should send a error message if there is a single argument given', () => {

        const handler = VersionCommandHandler.getHandler();

        let passedMessage = '';

        const cmd = {
            arguments: [
                "some-argument"
            ]
        };
        const bot = {
            sendMessage: function(params) {
                passedMessage = params.message;
            }
        };
        const db = {};
        const pubg = {};

        let sendMessageSpy = sinon.spy(bot, 'sendMessage');

        cmd.discordUser = {};
        cmd.discordUser.channelId = '123';

        //cmd, bot, db, pubg
        handler.handle(cmd, bot, db, pubg);

        sinon.assert.calledOnce(sendMessageSpy);
        expect(passedMessage).to.contain("invalid amount of arguments")

        sendMessageSpy.restore();
    });

    it('should send a error message if there are multiple arguments given', () => {

        const handler = VersionCommandHandler.getHandler();

        let passedMessage = '';

        const cmd = {
            arguments: [
                "some-argument",
                "some-other-argument",
                "some-last-argument"
            ]
        };
        const bot = {
            sendMessage: function(params) {
                passedMessage = params.message;
            }
        };
        const db = {};
        const pubg = {};

        let sendMessageSpy = sinon.spy(bot, 'sendMessage');

        cmd.discordUser = {};
        cmd.discordUser.channelId = '123';

        //cmd, bot, db, pubg
        handler.handle(cmd, bot, db, pubg);

        sinon.assert.calledOnce(sendMessageSpy);
        expect(passedMessage).to.contain("invalid amount of arguments")

        sendMessageSpy.restore();
    });

    it('should send a message containing the version of the bot', () => {       
        // TODO
    });

    // most important test right here
    it('should send a message containing the author of the bot', () => {
        // TODO
    });
})