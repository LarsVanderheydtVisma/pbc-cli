import { ReactElement } from 'react';
import ReactDOM from 'react-dom';
import { assert } from 'chai';
import { _name as name } from './[name].stories';

describe('name', () => {
    beforeEach(removeContainer);

    it('should render [name]', () => {
        mount(
            <div id="[nameLowerCase]">
                <name />
            </div>
        );

        const nameLowerCase = document.getElementById('[nameLowerCase]');
        assert.exists(nameLowerCase);
    });
});

const mount = (name: ReactElement): { div: HTMLElement } => {
    const div = document.createElement('div');
    div.dataset.testid = 'container';

    document.body.appendChild(div);
    ReactDOM.render(name, div);

    return {
        div,
    };
}

const removeContainer = () => {
    document.querySelector('[data-testid="container"]')?.remove();
}