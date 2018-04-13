/* 
 * Original version taken from:
 * https://github.com/alexa/skill-sample-nodejs-howto
 */

'use strict';

const Alexa = require('alexa-sdk');
const personAge = require('./person'); // Your list of intents

const APP_ID = undefined; // TODO replace with your app ID (OPTIONAL).

const languageStrings = {
    'en-GB': {
        translation: {
            PERSON_AGE: personAge.PERSON_AGE_EN_GB,
            SKILL_NAME: 'How old is',
            WELCOME_MESSAGE: "Welcome to %s - a template Alexa Skill by Chris Barker",
            WELCOME_REPROMPT: 'For instructions on what you can say, please say help me.',
            DISPLAY_CARD_TITLE: '%s - Info for %s.',
            HELP_MESSAGE: "You can ask questions... Now, what can I help you with?",
            HELP_REPROMPT: "You can say exit... Now, what can I help you with?",
            STOP_MESSAGE: 'Goodbye and thanks for using How old is',
            REPEAT_MESSAGE: 'Try saying repeat.',
            NOT_FOUND_MESSAGE: "I\'m sorry, I currently do not know ",
            NOT_FOUND_WITH_ITEM_NAME: 'an age for %s , ',
            NOT_FOUND_WITHOUT_ITEM_NAME: 'that persons age , ',
            NOT_FOUND_REPROMPT: 'Can I help you with anything else?',
        },
    }
};

const handlers = {
    //Use LaunchRequest, instead of NewSession if you want to use the one-shot model
    // Alexa, ask [my-skill-invocation-name] to (do something)...
    'LaunchRequest': function () {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));

        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');

        this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
        this.emit(':responseReady');
    },
    'PersonAgeIntent': function () {

        let itemSlot;
        let itemName;

        const personAgeList = this.t('PERSON_AGE');

        // .personSlot is the name of your expression slot
        if (this.event.request.intent.slots.personSlot.value) {
            itemSlot = this.event.request.intent.slots.personSlot;
        } 

        // get slot value
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
        }

        // get declaration
        const personAge = personAgeList[itemName];

        if (personAge) {
            this.attributes.speechOutput = personAge;
            this.attributes.repromptSpeech = this.t('REPEAT_MESSAGE');

            // pushes the response to the device and waits for users response 
            this.response.speak(personAge).listen(this.attributes.repromptSpeech);

            // pushes the response to the device no resonse from user
            //this.response.speak(personAge);
            
            this.emit(':responseReady');
        } else {

            // if failed to match an utterance & slot then inform the user
            let speechOutput = this.t('NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('NOT_FOUND_REPROMPT');

            // messages specific depending if a slot value was passed through
            if (itemName) {
                speechOutput += this.t('NOT_FOUND_WITH_ITEM_NAME', itemName);
            } else {
                speechOutput += this.t('NOT_FOUND_WITHOUT_ITEM_NAME');
            }

            speechOutput += repromptSpeech;

            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;

            this.response.speak(speechOutput).listen(repromptSpeech);
            this.emit(':responseReady');

        }

    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');

        this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
        this.emit(':responseReady');
    },
    'AMAZON.RepeatIntent': function () {
        this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak("Goodbye!");
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak("Goodbye!");
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        console.log(`Session ended: ${this.event.request.reason}`);
    },
    'Unhandled': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
        this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
        this.emit(':responseReady');
    },
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
