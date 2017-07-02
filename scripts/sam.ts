module App {

    export interface IDisposable {
        dispose: ()=>void;
    }

    export interface IModel {
        present: (data)=>void;
        state: IState;
        raw: any;
        widgets?:IDisposable[];
    }

    export interface IView {
        display: (html, element)=>void;
        init: (model)=>{};
        views: any;
    }

    export interface IState {
        representation: (model)=>void;
        render: (model)=>void;
        view: IView;
        states: any;
        nextAction?: (model)=>void;
    }


    export class StateActionModel<T extends IModel> {

        public model : T;
        public view : IView;
        public state : IState;
        public action;

        public Redraw = (representation)=>{};
        public Representation = (model)=>{ return '';};

        constructor(){

            this.view = {
                display:(html, element)=>{
                    element.innerHTML = html;
                }, 
                init: (model)=>{return null;}, 
                views: {}
            };

            this.state = {
                view: this.view,
                representation: (model)=>{
                    var representation = 'oops... something went wrong, the system is in an invalid state';
                    representation = this.Representation(model) || representation;
                    this.Redraw(representation);
                },
                render: (model)=>{
                    this.state.representation(model)
                    if(this.state.nextAction){
                        this.state.nextAction(model);
                    }
                },
                states: {}
            };

            this.model = <T>{
                present: (data)=>{},
                state: this.state,
                raw: null,
                widgets: []
            };

            this.action = {};
        }
    }

    export class Screen {
        public SAM : StateActionModel<IModel>;
        public Container : HTMLElement;
        public Template: string;
        public Element: HTMLElement;

        constructor(container: HTMLElement){
            this.SAM = new StateActionModel<IModel>();
            this.Container = container;
            this.Element = document.createElement('div');
            container.appendChild(this.Element);

            this.SAM.view.init = (model)=>{
                //setTimeout(()=>{
                    this.Load();
                //})
                return this.SAM.view.views.loading(model);
            };

            this.SAM.view.views.loading = (model)=>{
                return "<h3>Loading...</h3>";
            };

            this.SAM.view.views.ready = (model)=>{
                return this.Template;;
            };

            this.SAM.state.states.ready = (model: IModel)=>{
                return model.raw != null;            
            };

            this.SAM.state.states.loading = (model: IModel)=>{
                return model.raw == null;
            };

            this.SAM.model.present = (data)=>{
                if(data.raw){
                    this.SAM.model.raw = data.raw;
                }

                this.SAM.state.render(this.SAM.model) ;
            };

            this.SAM.Redraw = (representation)=>{ this.Redraw(this.Container, representation); };
            this.SAM.Representation = (model)=>{ return this.Representation(model); };

            this.SAM.view.display(this.SAM.view.init(this.SAM.model), this.Element);
        }

        public Load(){

        }

        public Representation(model){
            let representation = null;

            if (this.SAM.state.states.ready(model)) {
                representation = this.SAM.state.view.views.ready(model) ;
            } else if (this.SAM.state.states.loading(model)){
                this.Load();
                representation = this.SAM.state.view.views.loading(model) ;
            }

            return representation;
        }

        public Redraw(container: HTMLElement, representation: string){
            this.SAM.state.view.display(representation, container);
        }
    }
}