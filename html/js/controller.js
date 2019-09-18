const controller = {}

controller.register = async (registerInfo) => {
    if(!registerInfo.firstName){
        view.setMessage('firstName-error','Please input your first name');
    }else{
        view.setMessage('firstName-error','');
    
    }

    if(!registerInfo.lastName) {
        view.setMessage('lastName-error','Please input your last name');
    } else{
        view.setMessage('lastName-error','');
    }

    if(!registerInfo.email) {
        view.setMessage('email-error','Please input your email');

    }else{
        view.setMessage('email-error','');
    }

    if(!registerInfo.password) {
        view.setMessage('password-error','Please input your password');

   }else{
       view.setMessage('password-error','');
   }

   if (!registerInfo.confirmPassword || registerInfo.confirmPassword !== registerInfo.password){
       view.setMessage('confirmPassword-error','Confirm password did not match');

   }else{
       view.setMessage('confirmPassword-error','');
   }
  
   if(registerInfo.firstName && registerInfo.lastName && registerInfo.email && registerInfo.password && registerInfo.confirmPassword == registerInfo.password){
        try{
            await firebase.auth().createUserWithEmailAndPassword(registerInfo.email,registerInfo.password);
            
            firebase.auth().currentUser.updateProfile({
                displayName: `${registerInfo.firstName} ${registerInfo.lastName}`
            })
            firebase.auth().currentUser.sendEmailVerification();
            view.setMessage('form-success','Register success');
        }catch (error){
            view.setMessage('form-error',error.message)
        }
    }
}

controller.logIn = async (logInInfo) =>{
    // console.log('hi')
    if(logInInfo.email && logInInfo.password){
        try{
            const loginResult = await firebase.auth().signInWithEmailAndPassword(logInInfo.email,logInInfo.password);
        if(!loginResult.user.emailVerified){
            view.setMessage('form-error','Please verify your email first');
        
        }else{
            model.loginSuccess({
                uid: loginResult.user.uid,
                displayName: loginResult.user.displayName,
                email: loginResult.user.email,
            });

            view.setActiveScreen('chat')
        }
    }catch(error){
        view.setMessage('form-error',error.message)

    }
}
}

controller.addMessage = (newMessageContent) => {
   const newMessage = {
       content : newMessageContent,
       user :model.authUser.email,
       createdAt: new Date().toISOString()
   }

   model.addMessage(newMessage)
};

controller.changeActiveConversation = (newActiveConversationId) =>{
    model.changeActiveConversation(newActiveConversationId);
};

controller.createConversation