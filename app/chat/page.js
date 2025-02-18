'use client'; 

import { useState, useRef, useEffect } from 'react'; 
import axios from 'axios'; 
import styles from './page.module.css'; 
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'; 
import { materialDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'; 

export default function Chat() {
 
  //Gére les conversations / Manage the conversations
  const [conversations, setConversations] = useState([
    {
      id: Date.now(), 
      messages: [], 
      title: 'Nouvelle conversation',
    },
  ]);

  //Gére l'ID de la conversation sélectionnée / Manage the ID of the selected conversation
  const [selectedConversationId, setSelectedConversationId] = useState(
    conversations[0].id
  );

  //Gére la valeur du champ de saisie de l'utilistateur (chaine vide de base car l'utilisateur n'a rien tapé) / Manage the value of the user input field (empty by default)
  const [input, setInput] = useState('');

  //Défilement automatique vers le bas / Automatic scroll
  const messagesEndRef = useRef(null);

  //Fonction pour créer une nouvelle conversation / Function to create a new conversation
  const createNewConversation = () => {
    const newConversation = {
      id: Date.now(), 
      messages: [], 
      title: 'Nouvelle conversation',
    };
    setConversations((prev) => [...prev, newConversation]); 
    setSelectedConversationId(newConversation.id); 
  };

  //Fonction pour supprimer une conversation / Function to delete a conversation
  const deleteConversation = (id) => {
    //Evite de supprimer une conversation si il n'y en a qu'une / Avoid the possibility to delete the last conversation
    if (conversations.length === 1) {
      alert('Vous ne pouvez pas supprimer la dernière conversation.');
      return; //on arrête la fonction / stop the function
    }

    //Filtre les conversations pour supprimer celle avec l'ID correspondant / Filter the conversations to remove the one with the corresponding ID
    setConversations((prev) => prev.filter((conv) => conv.id !== id));

    //Si la conversation supprimée était celle qui était sélectionnée, on sélectionne la première conversation disponible / If the deleted conversation was the one that was selected, we select the first available conversation
    if (id === selectedConversationId) {
      setSelectedConversationId(conversations[0]?.id || null);
    }
  };

  //Fonction pour envoyer un message / Function to send a message
  const sendMessage = async () => {
    //On utilise return si l'utilisateur envoie un message vide / We use 'return' if the user send an empty message
    if (input.trim() === '' || !selectedConversationId) return;

    //On sélectionne la bonne conversation / We select the right conversation
    const selectedConversation = conversations.find(
      (conv) => conv.id === selectedConversationId
    );

    //On crée un message utilisateur / We create a user message
    const userMessage = { text: input, sender: 'paul' };
    const updatedConversation = {
      ...selectedConversation,
    messages: [...selectedConversation.messages, userMessage], //On ajoute le message envoyé à la liste des messages en copiant ses données avec ...selectedConversation / We add the sent message to the list of messages by copying its data with ...selectedConversation
    };

    //On met à jour le titre de la conversation avec le début du premier message / We update the title with the first letters of the message
    if (selectedConversation.messages.length === 0) {
      updatedConversation.title = input.substring(0, 20) + '...'; //on prend les 20 premiers caractères / We select the first 20 caracters
    }

    //On met à jour la liste des conversations / We update the conversation list
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversationId ? updatedConversation : conv
      )
    );

    //On utilise l'API de Mistral en envoyant le message / We use the Mistral API by sending the message
    try {
      const response = await axios.post('/api/chat', { message: input }); //Envoie de la requête à l'api Mistral / Sending the request to the Mistral API
      const botMessage = { text: response.data.reply, sender: 'mistralAI' };
      const updatedConversationWithBot = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, botMessage], //On ajoute la réponse du bot / We add the bot answer
      };

      //On met à jour la liste des conversations avec la réponse / We update the conversations list with the answer
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversationId ? updatedConversationWithBot : conv
        )
      );
    } catch (error) {
      console.error('Erreur API:', error); //On notifie dans la console si il y a une erreur avec l'API / We log a notification in the console if there is an error with the API
    }

    //On enlève ce que l'utilisateur avait mit dans l'input / We remove what was written in the input
    setInput('');
  };

  //Fonction pour effacer les messages de la conversation sélectionnée / Function to clear the selected conversation
  const clearConversation = () => {
    if (!selectedConversationId) return;

    //On réinitialise les messages de la conversation sélectionnée / We reset the messages of the selected conversation
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversationId ? { ...conv, messages: [] } : conv
      )
    );
  };

  //Fonction pour sélectionner une conversation / Function to select a conversation
  const selectConversation = (id) => {
    setSelectedConversationId(id);
  };

  //Fonction pour faire défiler les messages vers le bas / Function to scroll down the messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  //On fait défiler vers le bas à chaque mise à jour des messages / We scroll down when a message is sent
  useEffect(() => {
    scrollToBottom();
  }, [conversations, selectedConversationId]);

  //Fonction pour voir si un message contient du code / Function to detect code in a message
  const isCodeBlock = (text) => {
    return text.includes('```'); //'```' est souvent utilisé pour faire la délimitation des blocs de code / '```' is often used when we delimit block of codes
  };

  //Fonction pour extraire le code et le langage d'un message / Function to extract the message's code and langage 
  const extractCodeAndLanguage = (text) => {
    const codeBlock = text.match(/```(\w+)?[\s\S]*?```/g);
    if (codeBlock) {
      const languageMatch = codeBlock[0].match(/```(\w+)/);
      const language = languageMatch ? languageMatch[1] : 'javascript'; //Langage par défaut / Default langage
      const code = codeBlock[0].replace(/```(\w+)?/g, '').trim(); //On extrait le code en supprimant les '```' et le langage / We extract the code by removing the '```' and the language
      return { language, code };
    }
    return null; //On retourne null si aucun bloc n'est trouvé / Return 'null' if no block is found
  };

  //On récupère les messages de la conversation sélectionnée / We retrieve the messages from the selected conversation
  const selectedConversation = conversations.find(
    (conv) => conv.id === selectedConversationId
  );
  const messages = selectedConversation ? selectedConversation.messages : [];


  /************************ Partie qui représente le rendu JSX / JSX rendering Part *******************************************/
  
  
  return (
    <div className={styles.container}>
      <h1 className={styles.titre}>Mistral AI</h1>
      <div className={styles.layout}>
        {/*Sidebar pour l'historique des conversations / History sidebar for the conversations*/}
        <div className={styles.sidebar}>
          <button onClick={createNewConversation} className={styles.newConversationButton}>Nouvelle conversation</button>
          <ul className={styles.conversationList}>
            {conversations.map((conv) => (  // on parcourt le tableau conversations pour afficher chaque conversation / We iterate through the conversations array to display each conversation
              <li
                key={conv.id}
                className={`${styles.conversationItem} ${
                  conv.id === selectedConversationId ? styles.selected : ''}`}
                onClick={() => selectConversation(conv.id)}
              >
                {conv.title}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); //ça permet d'empêcher qu'on sélectionne la conversation pendant la suppression / Avoid the selection of the conversation during the suppression
                    deleteConversation(conv.id);
                  }}
                  className={styles.deleteButton}
                  disabled={conversations.length === 1} //On désactive le bouton s'il n'y a qu'une conversation / We turn off the button if there is only one conversation left
                  >×</button>
              </li>
            ))}
          </ul>
        </div>

        {/*Zone du chat / chat zone*/}
        <div className={styles.chatArea}>
          <div className={styles.messages}> {/*On parcourt le tableau messages pour afficher chaque message / We iterate through the messages array to display each message */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${styles.message} ${styles[msg.sender]}`}
              >
                <strong>{msg.sender} : </strong>
                {isCodeBlock(msg.text) ? (  //Vérifie si le message contient du code / Check if the message include code
                  <div>
                    {/*Affiche le langage du code / Print the langage of the code*/}
                    <div className={styles.codeLanguage}>
                      ({extractCodeAndLanguage(msg.text).language})
                    </div>
                    {/*Affiche le bloc de code / Print the code cloc*/}
                    <div className={styles.codeBlock}>
                      <SyntaxHighlighter
                        language={extractCodeAndLanguage(msg.text).language}
                        style={materialDark}
                        customStyle={{
                          padding: '0',
                          margin: '0',
                        }}
                      >
                        {extractCodeAndLanguage(msg.text).code}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                ) : (
                  msg.text
                )}
              </div>
            ))}
            <div ref={messagesEndRef} /> {/*pour le défilement automatique / for the automatic scroll down*/}
          </div>
          <div className={styles.inputContainer}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className={styles.input}
              placeholder="Envoyez votre message à MistralAI"
            />
            <button onClick={sendMessage} className={styles.button}>
              Envoyer
            </button>
            <button onClick={clearConversation} className={styles.button}>
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}