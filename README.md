# MistralAPI [EN/FR]

README : English Version

This project is a Next.js application that uses the Mistral AI API to generate automated responses based on user messages.

Features :
 - Send messages to a chatbot powered by Mistral AI
 - Receive and display AI-generated responses
 - Secure API key management using environment variables
 - Manage user conversations (create and delete conversations)
 - Detect code snippets in the bot's response and display them with proper indentation

Installation & Launch :
- Clone the project, navigate to the folder, and install dependencies:
  1) Open your terminal
  2) Run the command: git clone https://github.com/Tomikz/MistralAPI
  3) Navigate to the folder with: cd MistralAPI
  4) Install dependencies using: npm install

- Configure environment variables and start the project:
  1) Create a .env.local file at the root of the project and add: MISTRAL_API_KEY=your_mistral_api_key
  2) Start the project in development mode inside the chatbot-mistral folder with: npm run dev
  3) Access the site at: http://localhost:3000/chat

-----------------------------------------------------------------------------------------------------------------------------------------------------------------

README : Version française

Ce projet est une application Next.js qui utilise l'API Mistral AI pour générer des réponses automatisées à partir des messages envoyés par les utilisateurs.

Fonctionnalités :
- Envoi de messages à un chatbot basé sur Mistral AI
- Réception et affichage des réponses générées par l'IA
- Gestion sécurisée de la clé API avec les variables d'environnement
- Gestion des conversations de l'utilisateur (possibilité d'en créer et d'en supprimer)
- Détection de code dans la réponse du bot et affichage avec indentation du code sur cette réponse

Installation & Lancement :
- Cloner le projet , se rendre dans le dossier et installer les dépendances:
  1) Lancez votre terminal
  2) Executez la commande : git clone https://github.com/Tomikz/MistralAPI
  3) Rendez vous dans le dossier avec la commande : cd MistralAPI
  4) Installez les dépendances avec la commande : npm install
      
- Configurer les variables d'environnement et lancer le projet
  1) Crée un fichier .env.local à la racine du projet et ajoute : MISTRAL_API_KEY=ta_cle_api_mistral
  2) Lancez le projet en mode développement toujours dans le dossier chatbot-mistral avec la commande : npm run dev
  3) Pour accéder au site, rendez vous à cette url : http://localhost:3000/chat
