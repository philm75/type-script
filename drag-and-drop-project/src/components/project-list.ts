import Component from '../components/base-components';
import { projectState } from '../state/project-state';
import { Project } from '../models/project';
import { DragTarget } from '../models/drag-drop'; 
import { autobind } from '../decorators/autobind';
import { ProjectStatus } from '../models/project'; 
import { ProjectItem } from './project-item';

export class ProjectList extends Component<HTMLDivElement, HTMLElement> 
    implements DragTarget {
    
    assignedProjects: Project[];
    
    constructor(private type: 'active' | 'finished') {
        super('project-list','app', false, `${type}-projects`);
        this.assignedProjects = [];
        this.configure();
        this.renderContent();
    }

    @autobind
    dragOverHandler(event: DragEvent) {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault();
            const listEl = this.element.querySelector('ul')!;
            listEl.classList.add('droppable'); 
        }
    }
    
    @autobind
    dropHandler(event: DragEvent) {
        const prjId = event.dataTransfer!.getData('text/plain');   
        
        projectState.moveProject(prjId, 
            this.type === 'active' ? 
            ProjectStatus.Active : 
            ProjectStatus.Finished
        ); 
    }
    
    dropLeaveHandler(_: DragEvent) {
        const listEl = this.element.querySelector('ul')!;
        listEl.classList.remove('droppable'); 
    }

    private renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;        
        listEl.innerHTML = '';
        this.assignedProjects.forEach(prjItem => 
            new ProjectItem(this.element.querySelector('ul')!.id, prjItem));
    }

    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = 
            this.type.toUpperCase() + ' PROJECTS';    
    }

    configure() {
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('dragleave', this.dropLeaveHandler);
        this.element.addEventListener('drop', this.dropHandler);

        projectState.addListener((projects:Project[]) => {
            const relevantProjects = projects.filter(prj => {
                if (this.type === 'active') {
                    return prj.status === ProjectStatus.Active;
                } else {
                    return prj.status = ProjectStatus.Finished;
                }
            });
            
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });
    }    
}