
import { NextResponse } from 'next/server'; //On importe NextResponse pour les réponses HTTP /We import NextResponse for the HTTP responses
import axios from 'axios'; //On importe axios pour les requêtes HTTP / Import of axios for the HTTP requests

export async function POST(request) {
  const { message } = await request.json(); //On récupère le message envoyé par l'utilisateur / We recover the user message

  try {
    //Envoie le message à l'API Mistral AI / We send the message to the Mistral API
    const response = await axios.post( 
      'https://api.mistral.ai/v1/chat/completions', //URL de l'API / API url
      {
        model: 'codestral-latest', //modèle utilisé / used model
        messages: [
          {
            role: 'user',
            content: message, //Message de l'utilisateur / user's message
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`, //Clé API / API key
          'Content-Type': 'application/json',
        },
      }
    );

    //renvoie la réponse du bot / bot's response
    const botReply = response.data.choices[0].message.content; //on extrait la réponse du bot / We recover the response
    return NextResponse.json({ reply: botReply });
  } catch (error) { //Gestion des erreurs / Error Management  
    console.error('Erreur API:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la communication avec l\'API' },
      { status: 500 }
    );
  }
}