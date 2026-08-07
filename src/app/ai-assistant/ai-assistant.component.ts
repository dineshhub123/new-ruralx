import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-ai-assistant',
  templateUrl: './ai-assistant.component.html',
  styleUrls: ['./ai-assistant.component.scss']
})
export class AiAssistantComponent {
  messages: any[] = [];
  isListening = false;
  currentStep = 'product';
  conversationData: any = {};

  constructor(private bottomSheetRef: MatBottomSheetRef<AiAssistantComponent>) {}

  close() {
    this.bottomSheetRef.dismiss();
  }

  startConversation() {
    const welcomeMessage = "Hello! I'm Ruralx Mitra. What are you looking for today?";

    this.messages.push({
      sender: 'ai',
      text: welcomeMessage
    });

    this.speak(welcomeMessage);
  }

  speak(text: string) {
    if (!('speechSynthesis' in window)) {
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 1;
    utterance.pitch = 1;
   utterance.onend = () => {
    setTimeout(() => {
        this.startListening();
    },300);

};    window.speechSynthesis.speak(utterance);
  }


  startListening() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    this.isListening = true;
    recognition.start();

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;

      this.messages.push({
        sender: 'user',
        text
      });

      this.isListening = false;
      this.processUserMessage(text);
    };

    recognition.onerror = () => {
      this.isListening = false;
    };
  }

processUserMessage(message: string) {
  const text = message.toLowerCase();
  switch (this.currentStep) {
    case 'product':
      this.conversationData.product = text;
      this.reply(
        'Sure! Who are you shopping for?',
        ['Men', 'Women', 'Boys', 'Girls']
      );
      this.currentStep = 'category';
      break;
    case 'category':
      this.conversationData.category = text;
      this.reply(
        'What is the age?',
        []
      );
      this.currentStep = 'age';
      break;
    case 'age':
      this.conversationData.age = text;
      this.reply(
        'What is your budget?',
        ['₹299', '₹499', '₹999', '₹1999']
      );
      this.currentStep = 'budget';
      break;
    case 'budget':
      this.conversationData.budget = text;
      this.reply(
        'Great! Searching products...',
        []
      );
      console.log(this.conversationData);
      // API Call Here
      break;

  }

}
reply(text: string, chips: string[]) {
  this.messages.push({
    sender: 'ai',
    text: text,
    chips: chips
  });

  this.speak(text);
}

}
