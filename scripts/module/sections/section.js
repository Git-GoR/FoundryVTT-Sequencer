import * as lib from "../lib.js";
import BaseSection from "./base.js";

export default class Section extends BaseSection{

    constructor(inSequence){
        super(inSequence);
        this._playIf = true;
        this._async = false;
        this._offsets = [];
        this._waitUntilFinishedDelay = 0;
        this._repetitions = 1;
        this._currentRepetition = 0;
        this._repeatDelayMin = 0;
        this._repeatDelayMax = 0;
        this._repeatDelay = 0;
        this._delayMin = 0;
        this._delayMax = 0;
        this._basicDelay = 0;
        this._index = this.sequence.effectIndex;
        this._duration = false;
        this._fadeIn = false;
        this._fadeOut = false;
        this._mustache = false;
        this._volume = false;
        this._fadeInAudio = false;
        this._fadeOutAudio = false;
    }

    /**
     * Causes the effect or sound to be repeated n amount of times, with an optional delay. If given inRepeatDelayMin
     * and inRepeatDelayMax, a random repetition delay will be picked for every repetition
     *
     * @param {number} inRepetitions
     * @param {number} inRepeatDelayMin
     * @param {number} inRepeatDelayMax
     * @returns {Section} this
     */
    repeats(inRepetitions, inRepeatDelayMin = 0, inRepeatDelayMax){
        if(typeof inRepetitions !== "number") this.sequence._throwError(this, "repeats", "inRepetitions must be of type number");
        if(typeof inRepeatDelayMin !== "number") this.sequence._throwError(this, "repeats", "repeatDelayMin must be of type number");
        if(inRepeatDelayMax && typeof inRepeatDelayMax !== "number"){
            this.sequence._throwError(this, "repeats", "repeatDelayMax must be of type number");
        }
        this._repetitions = inRepetitions;
        this._repeatDelayMin = Math.min(inRepeatDelayMin, inRepeatDelayMax ?? inRepeatDelayMin);
        this._repeatDelayMax = Math.max(inRepeatDelayMin, inRepeatDelayMax ?? inRepeatDelayMin);
        return this;
    }

    /**
     * Causes the effect or sound to not play, and skip all delays, repetitions, waits, etc. If you pass a function,
     * the function should return something false-y if you do not want the effect or sound to play.
     *
     * @param {boolean|function} inCondition
     * @returns {Section} this
     */
    playIf(inCondition) {
        if(!(typeof inCondition === "boolean" || lib.is_function(inCondition))){
            this.sequence._throwError(this, "playIf", "inCondition must be of type boolean or function");
        }
        this._playIf = inCondition;
        return this;
    }

    /**
     * Causes the section to finish running before starting the next section.
     *
     * @param {number} [inDelay=0] inDelay
     * @returns {Section} this
     */
    waitUntilFinished(inDelay=0){
        if(typeof inDelay !== "number") this.sequence._throwError(this, "waitUntilFinished", "inDelay must be of type number");
        this._waitUntilFinished = true;
        this._waitUntilFinishedDelay = inDelay;
        return this;
    }

    /**
     * Causes each effect or sound to finish playing before the next one starts playing. This differs from
     * .waitUntilFinished() in the sense that this is for each repetition, whilst .waitUntilFinished() is
     * for the entire section.
     *
     * @returns {Section} this
     */
    async(){
        this._async = true;
        return this;
    }

    /**
     * Delays the effect or sound from being played for a set amount of milliseconds. If given a second number, a
     * random delay between the two numbers will be generated.
     *
     * @param {number} [msMin=1] minMs
     * @param {number} [msMax=1] maxMs
     * @returns {Section} this
     */
    delay(msMin, msMax) {
        if(typeof msMin !== "number") this.sequence._throwError(this, "delay", "msMin must be of type number");
        if(msMax && typeof msMax !== "number") this.sequence._throwError(this, "delay", "msMax must be of type number");
        this._delayMin = Math.min(msMin, msMax ?? msMin);
        this._delayMax = Math.max(msMin, msMax ?? msMin)
        return this;
    }

    /**
     * Sets the Mustache of the filepath. This is applied after the randomization of the filepath, if available.
     *
     * @param {object} inMustache
     * @returns {Section} this
     */
    setMustache(inMustache) {
        if(typeof inMustache !== "object") this.sequence._throwError(this, "setMustache", "inMustache must be of type object");
        this._mustache = inMustache;
        return this;
    }

    /**
     * Overrides the duration of an effect or sound
     *
     * @param {number} inDuration
     * @returns {Section} this
     */
    duration(inDuration){
        if(typeof inDuration !== "number") this.sequence._throwError(this, "duration", "inDuration must be of type number");
        this._duration = inDuration;
        return this;
    }

    /**
     * Sets the volume of the sound.
     *
     * @param {number} inVolume
     * @returns {Section} this
     */
    volume(inVolume) {
        if(typeof inVolume !== "number") this.sequence._throwError(this, "volume", "inVolume must be of type number");
        this._volume = Math.max(0, Math.min(1.0, inVolume));
        return this;
    }

    /**
     * Causes the animated section to fade in its audio (if any) when played
     *
     * @param {number} duration     How long the fade should be
     * @param {object} [options]    Additional options, such as easing and delay
     * @returns {Section} this
     */
    fadeInAudio(duration, options={}) {
        if(typeof options !== "object") this.sequence._throwError(this, "fadeInAudio", "options must be of type object");
        options = foundry.utils.mergeObject({
            ease: "linear",
            delay: 0
        }, options);
        if(typeof duration !== "number") this.sequence._throwError(this, "fadeInAudio", "duration must be of type number");
        if(typeof options.ease !== "string") this.sequence._throwError(this, "fadeInAudio", "options.ease must be of type string");
        if(typeof options.delay !== "number") this.sequence._throwError(this, "fadeInAudio", "options.delay must be of type number");
        this._fadeInAudio = {
            duration: duration,
            ease: options.ease,
            delay: options.delay
        };
        return this;
    }

    /**
     * Causes the audio to fade out at the end of the animated section's duration
     *
     * @param {number} duration     How long the fade should be
     * @param {object} [options]    Additional options, such as easing and delay
     * @returns {Section} this
     */
    fadeOutAudio(duration, options={}) {
        if(typeof options !== "object") this.sequence._throwError(this, "fadeOutAudio", "options must be of type object");
        options = foundry.utils.mergeObject({
            ease: "linear",
            delay: 0
        }, options);
        if(typeof duration !== "number") this.sequence._throwError(this, "fadeOutAudio", "duration must be of type number");
        if(typeof options.ease !== "string") this.sequence._throwError(this, "fadeOutAudio", "ease must be of type string");
        if(typeof options.delay !== "number") this.sequence._throwError(this, "fadeOutAudio", "delay must be of type number");
        this._fadeOutAudio = {
            duration: duration,
            ease: options.ease,
            delay: options.delay
        };
        return this;
    }

    /**
     * Causes the effect to fade in when played
     *
     * @param {number} duration     How long the fade should be
     * @param {object} [options]    Additional options, such as easing and delay
     * @returns {Section} this
     */
    fadeIn(duration, options={}) {
        if(typeof options !== "object") this.sequence._throwError(this, "fadeIn", "options must be of type object");
        options = foundry.utils.mergeObject({
            ease: "linear",
            delay: 0
        }, options);
        if(typeof duration !== "number") this.sequence._throwError(this, "fadeIn", "duration must be of type number");
        if(typeof options.ease !== "string") this.sequence._throwError(this, "fadeIn", "options.ease must be of type string");
        if(typeof options.delay !== "number") this.sequence._throwError(this, "fadeIn", "options.delay must be of type number");
        this._fadeIn = {
            duration: duration,
            ease: options.ease,
            delay: options.delay
        };
        return this;
    }

    /**
     * Causes the effect to fade out at the end of the effect's duration
     *
     * @param {number} duration     How long the fade should be
     * @param {object} [options]    Additional options, such as easing and delay
     * @returns {Section} this
     */
    fadeOut(duration, options={}) {
        if(typeof options !== "object") this.sequence._throwError(this, "fadeOut", "options must be of type object");
        options = foundry.utils.mergeObject({
            ease: "linear",
            delay: 0
        }, options);
        if(typeof duration !== "number") this.sequence._throwError(this, "fadeOut", "duration must be of type number");
        if(typeof options.ease !== "string") this.sequence._throwError(this, "fadeOut", "ease must be of type string");
        if(typeof options.delay !== "number") this.sequence._throwError(this, "fadeOut", "delay must be of type number");
        this._fadeOut = {
            duration: duration,
            ease: options.ease,
            delay: options.delay
        };
        return this;
    }

    async _shouldPlay(){
        return lib.is_function(this._playIf) ? await this._playIf() : this._playIf;
    }

    get _shouldAsync(){
        return this._async || this._waitAnyway
    }

    get _waitAnyway(){
        return (this._async || this._waitUntilFinished)
            && (this._repetitions === 1 || this._repetitions === this._currentRepetition+1)
    }

    get _currentWaitTime(){
        let waitUntilFinishedDelay = this._waitAnyway ? this._waitUntilFinishedDelay : 0;
        return waitUntilFinishedDelay + this._basicDelay + this._repeatDelay;
    }

    async _prepareOffsetCache(){
        this._offsets = [];
        for (let index = 0; index < this._repetitions; index++) {
            this._cacheOffsets();
        }
    }

    /**
     * Overridden method in EffectSection
     */
    _cacheOffsets(){}

    async _execute(){
        if(!(await this._shouldPlay())) return;
        let self = this;
        this._basicDelay = lib.random_float_between(this._delayMin, this._delayMax);
        return new Promise(async (resolve) => {
            setTimeout(async function () {
                for (let i = 0; i < self._repetitions; i++) {
                    self._currentRepetition = i;
                    self._repeatDelay = i !== self._repetitions-1 ? lib.random_float_between(self._repeatDelayMin, self._repeatDelayMax) : 0;
                    if (self._shouldAsync) {
                        await self._run();
                    } else {
                        self._run();
                    }
                    if (self._repetitions > 1 && i !== self._repetitions-1) {
                        await self._delayBetweenRepetitions();
                    }
                }
                resolve();
            }, this._basicDelay);
        });
    }

    async _delayBetweenRepetitions(){
        let self = this;
        return new Promise((resolve) => {
            setTimeout(resolve, self._repeatDelay)
        });
    }

    async _run(){}

}