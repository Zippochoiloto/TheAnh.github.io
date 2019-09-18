const view = {}

view.setActiveScreen = (screenName) =>{
    switch (screenName) {
        case 'register' :
            // mount register screen
            document.getElementById('app').innerHTML=components.register;
            

            // add register button listeners
            document.getElementById("already-have-account").addEventListener('click', () =>
                view.setActiveScreen('logIn'));

            const registerForm = document.getElementById('register-form');
            registerForm.addEventListener('submit', (e) =>{
                e.preventDefault();

                const registerInfo = {
                    firstName : registerForm.firstName.value,
                    lastName : registerForm.lastName.value,
                    email: registerForm.email.value,
                    password: registerForm.password.value,
                    confirmPassword: registerForm.confirmPassword.value,

                };
                controller.register(registerInfo);               
            });
            break;

        case 'logIn' :
            //mount loginscreen
            document.getElementById('app').innerHTML = components.logIn;
            
            // add register button listeners
            document.getElementById('create-account-button').addEventListener('click', () => view.setActiveScreen('register'));


            // add form submit listerners
            const logInForm = document.getElementById('logIn-form');
            logInForm.addEventListener('submit' , (e) =>{
                e.preventDefault();

                const logInInfo = {
                    email: logInForm.email.value,
                    password: logInForm.password.value,
                }
            controller.logIn(logInInfo)

            
            })
            
            break;
        
            case 'chat':
                //mount chat screen
                document.getElementById('app').innerHTML= components.chat;

                // add message from listener

                document.getElementById('create-conversation').addEventListener('click', () =>view.setActiveScreen('createConversation'))
                const messageForm = document.getElementById('message-form');
                messageForm.addEventListener('submit' ,(e) =>{
                    e.preventDefault();

                    const newMessage = messageForm.message.value;
                    controller.addMessage(newMessage);

                    messageForm.message.value = '';
                })
                model.loadConversations();
                break;

            case 'createConversation':
                // mount createConversation screen
                document.getElementById('app').innerHTML = components.createConversation;

                //listen to "Cancel" button
                document.getElementById('cancel-create-conversation').addEventListener('click', () => view.backToChatScreen());
                
                //listen to form submit
                const createConversationForm = document.getElementById('create-conversation-form');
                createConversationForm.addEventListener('submit',(e) =>{
                    e.preventDefault();

                    const conversationName = createConversationForm.conversationName.value;
                    const friendEmail = createConversationForm.friendEmail.value;
                    
                    controller.createConversation({
                        conversationName,
                        friendEmail,
                    });

                });
                break;

                // document.getElementById('create-conversation').addEventListener('click', () => view.setActiveScreen('createConversation'));
    }
};


view.setMessage = (elementId, message = '') => {
    document.getElementById(elementId).innerText = message;
}

view.addMessage = (messageObject) =>{
    const messageContainer = document.createElement('div')
    // Create a div tab

    messageContainer.classList.add('message-container');
    // console.log("Im here");

    const message = document.createElement('div');
    message.classList.add('message');
    message.innerText = messageObject.content

    // console.log(messageObject.user)
    // console.log(model.authUser.email)
    if(messageObject.user == model.authUser.email){
        messageContainer.classList.add('your');
    }else{
        const sender = document.createElement('div');
        sender.classList.add('sender');
        sender.innerText = messageObject.user;
        messageContainer.appendChild(sender);
    }

    messageContainer.appendChild(message);
    document.getElementById('conversation-messages').appendChild(messageContainer);

    // scroll to bottom
    messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
};

view.addConversation = (conversationObj) =>{
    const conversationName = document.createElement('span');
    conversationName.innerText = conversationObj.name;

    const conversationContainer = document.createElement('div');
    conversationContainer.classList.add('conversation');
    conversationContainer.id = conversationObj.id;
    conversationContainer.appendChild(conversationName);

    if(conversationObj.id === model.activeConversation.id){
        conversationContainer.classList.add('selected-conversation');
    }

    document.getElementById('conversation-list').appendChild(conversationContainer);

    conversationContainer.addEventListener('click',() =>{
        model.changeActiveConversation(conversationObj.id);
    })

    document.getElementById('conversation-list').appendChild(conversationContainer);
}

view.changeActiveConversation =()=>{
    // change conversation Name
    document.getElementById('conversation-name').innerText = model.activeConversation.name;

    //change selected conversation style
    document.querySelector('selected-conversation').classList.remove('selected-conversation');
    document.getElementById(model.activeConversation.id).classList.add(selected-conversation);

    // re-render messages
    document.getElementById('conversation-messages').innerHTML = '';
    for(let message of model.activeConversation.messages) {
        view.addMessage(message);
    }
};

view.backToChatScreen = () =>{
    //mount chat screen
    document.getElementById('app').innerHTML = components.chat;

    // add message from listener
    const messageForm = document.getElementById('message-Form');
    messageForm.addEventListener('submit' , (e) => {
        e.preventDefault();

        const newMessage = messageForm.message.value;
        controller.addMessage(newMessage);

        messageForm.message.value = '';
    });

    document.getElementById('create-conversation').addEventListener('click', () =>view.setActiveScreen('createConversation'))

    for (let conversation of model.conversations){
        view.addConversation(conversation);
    }

    for(let message of model.activeConversation.messages){
        view.addMessage(message);
    }
};

