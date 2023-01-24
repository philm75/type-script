import Component from './base-components';
import { autobind } from '../decorators/autobind';
import * as Validation from '../util/validation';
import { projectState } from '../state/project-state';

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    
    titleInput: HTMLInputElement;
    descriptionInput: HTMLInputElement;
    peopleInput: HTMLInputElement;

    constructor() {
        super('project-input', 'app', true, 'user-input');
        this.titleInput = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInput = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInput = this.element.querySelector('#people') as HTMLInputElement;
        this.configure();
    }

    private clearInputs() {
        this.titleInput.value = '';
        this.descriptionInput.value = '';
        this.peopleInput.value = '';                
    }

    @autobind
    private submitHandler(event: Event) {
        event.preventDefault();
        const userInput = this.getInput();
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;            
            projectState.addProject(title, desc, people);
            this.clearInputs();
        }
    }

    private getInput(): [string, string, number] | void {
        const enteredTitle = this.titleInput.value;
        const enteredDescription = this.descriptionInput.value;
        const enteredPeople = this.peopleInput.value;

        const titleValidatable: Validation.Validatable = {
            value: enteredTitle,
            required: true
        }

        const descriptionValidatable: Validation.Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5
        }

        const peopleValidatable: Validation.Validatable = {
            value: +enteredPeople,
            required: true,
            min: 1
        }

        if (!Validation.validate(titleValidatable) ||
            !Validation.validate(descriptionValidatable) ||
            !Validation.validate(peopleValidatable)) {
            alert('Invalid input, please try again!');            
            return;
        } else {
            return [
                enteredTitle,
                enteredDescription,
                +enteredPeople
            ];
        }
    }

    configure() {
        this.element.addEventListener('submit', this.submitHandler.bind(this));
    }

    renderContent() {}
}