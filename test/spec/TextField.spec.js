/**
 * @file textfield test case
 * @author asd123freedom@gmail.com
 */

import {expect} from 'chai';
import san from 'san';
import TextField from 'src/TextField';
import 'src/TextField/index.styl';

describe('TextField', () => {
    // prepare for testing
    const viewport = document.createElement('div');
    viewport.id = 'test';

    before(() => {
        document.body.appendChild(viewport);
    });

    after(() => {
        viewport.remove();
    });

    const createComponent = function (options) {
        let Component = san.defineComponent(
            Object.assign({
                components: {
                    'ui-input': TextField
                },
                initData() {
                    return {};
                }
            }, options)
        );
        let component = new Component();
        component.attach(viewport);
        return component;
    };

    it('simple use', done => {
        let component = createComponent({
            template: '<div><ui-input hintText="提示文字"/></div>'
        });
        let el = component.children[0].el;
        let inputElement = el.querySelector('input');
        let hintElement = el.querySelector('.sm-text-field-hint');
        let focusLineElement = el.querySelector('.sm-text-field-focus-line');
        expect(el.tagName).to.equal('DIV');
        expect(el.className).to.equal('sm-text-field');
        expect(hintElement.innerText.trim()).to.equal('提示文字');
        // component.children[0].data.set('focus', true);
        inputElement.focus();
        component.nextTick(() => {
            expect(focusLineElement.classList.contains('focus')).to.equal(true);
            expect(el.classList.contains('focus-state')).to.equal(true);
            component.dispose();
            done();
        });
    });

    it('multi lines use', () => {
        let component = createComponent({
            template: `
                <div>
                    <ui-input
                        disabled="{{disabled}}"
                        hintText="提示文字"
                        multiLine
                        rows="{{3}}"
                        rowsMax="{{6}}"/>
                </div>`,
            initData() {
                return {
                    disabled: false
                }
            }
        });
        let input = component.children[0];
        let inputElement = input.el.querySelector('textarea');
        expect(inputElement).to.be.not.null;
        expect(input.data.get('disabled')).to.equal(false);
        input.data.set('disabled', true);
        component.nextTick(() => {
            const {cursor} = getComputedStyle(inputElement);
            expect(cursor).to.equal('not-allowed');
            component.dispose();
        });
    });

    it('use label', done => {
        let component = createComponent({
            template: '<div><ui-input label="标签文字" labelFocusClass="focusClass"/></div>'
        });
        let el = component.children[0].el;
        let inputElement = el.querySelector('input');
        let labelElement = el.querySelector('.sm-text-field-label');
        expect(el.tagName).to.equal('DIV');
        expect(labelElement.innerText.trim()).to.equal('标签文字');
        expect(labelElement.classList.contains('focusClass')).to.equal(false);
        // component.children[0].data.set('focus', true);
        inputElement.focus();
        component.nextTick(() => {
            expect(el.classList.contains('focus-state')).to.equal(true);
            expect(labelElement.classList.contains('focusClass')).to.equal(true);
            component.dispose();
            done();
        });
    });

    it('use float label', done => {
        let component = createComponent({
            template: '<div><ui-input labelFloat label="标签文字"/></div>'
        });
        let el = component.children[0].el;
        let inputElement = el.querySelector('input');
        let labelElement = el.querySelector('.sm-text-field-label');
        expect(el.tagName).to.equal('DIV');
        expect(labelElement.classList.contains('state-float')).to.equal(true);
        expect(labelElement.innerText.trim()).to.equal('标签文字');
        // component.children[0].data.set('focus', true);
        inputElement.focus();
        component.nextTick(() => {
            expect(labelElement.classList.contains('state-float')).to.equal(false);
            component.dispose();
            done();
        });
    });

    it('set type', () => {
        let component = createComponent({
            template: '<div><ui-input type="password" label="标签文字"/></div>'
        });
        let el = component.children[0].el;
        let inputElement = el.querySelector('input');
        expect(el.tagName).to.equal('DIV');
        expect(inputElement.getAttribute('type')).to.equal('password');
        component.dispose();
    });

    it('set full width', () => {
        let component = createComponent({
            template: '<div><ui-input fullWidth label="标签文字"/></div>'
        });
        let el = component.children[0].el;
        expect(getComputedStyle(el, null)['width']).to.equal(getComputedStyle(component.el, null)['width']);
        component.dispose();
    });

    it('error text', () => {
        let component = createComponent({
            template: '<div><ui-input hintText="标签文字" errorText="错误文字"/></div>'
        });
        let el = component.children[0].el;
        let focusLineElement = el.querySelector('.sm-text-field-focus-line');
        expect(el.classList.contains('error')).to.equal(true);
        expect(focusLineElement.classList.contains('error')).to.equal(true);
        component.dispose();
    });

    it('error color', () => {
        let component = createComponent({
            template: '<div><ui-input hintText="标签文字" errorText="错误文字" errorColor="#2196f3"/></div>'
        });
        let el = component.children[0].el;
        let focusLineElement = el.querySelector('.sm-text-field-focus-line');
        expect(el.classList.contains('error')).to.equal(true);
        expect(el.style.color).to.equal('rgb(33, 150, 243)');
        expect(focusLineElement.classList.contains('error')).to.equal(true);
        component.dispose();
    });

    it('disabled input', () => {
        let component = createComponent({
            template: '<div><ui-input hintText="提示文字" disabled/></div>'
        });
        let input = component.children[0];
        let UnderLineElement = input.el.querySelector('.sm-text-field-line');
        let inputElement = input.el.querySelector('input');
        expect(input.el.classList.contains('disabled')).to.equal(true);
        expect(inputElement.disabled).to.equal(true);
        expect(UnderLineElement.classList.contains('disabled')).to.equal(true);

        const {cursor} = getComputedStyle(inputElement);
        expect(cursor).to.equal('not-allowed');
        component.dispose();
    });

    it('character count', done => {
        let component = createComponent({
            template: `<div>
                <ui-input
                    inputValue="{=inputValue=}"
                    hintText="最多不超过10个字符"
                    errorText="{{inputErrorText}}"
                    on-textOverflow="handleInputOverflow($event)"
                    maxLength="{{9}}"/>
            </div>`,

            handleInputOverflow(isOverflow) {
                this.data.set('inputErrorText', isOverflow === 'true' ? 'overflow' : '');
            }
        });
        component.data.set('inputValue', '1234567890');
        let el = component.children[0].el;
        let inputElement = el.querySelector('input');
        let helpElement = el.querySelector('.sm-text-field-help');
        inputElement.focus();
        // component.children[0].data.set('focus', true);
        let focusLineElement = el.querySelector('.sm-text-field-focus-line');
        component.nextTick(() => {
            let children = helpElement.children;
            children = Array.prototype.slice.call(children);
            let charElement = children[0];
            let numElement = children[1];
            expect(charElement.innerText).to.equal('overflow');
            expect(numElement.innerText).to.equal('10/9');
            expect(el.classList.contains('error')).to.equal(true);
            expect(focusLineElement.classList.contains('error')).to.equal(true);
            component.dispose();
            done();
        });
    });
});
