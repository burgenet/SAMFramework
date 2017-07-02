module App.Test {

    export class LoginScreen extends Screen {
        public Template = `
            <h3>Login In Here</h3>
        `;

        constructor(container: HTMLElement){
            super(container);
        }

        public Load(){
            setTimeout(()=>{
                this.SAM.model.present({raw: {}});
            },2000);
        }
    }

}

setTimeout(function(){

    const ls = new App.Test.LoginScreen(document.getElementById("screencontainer"));

}, 250);