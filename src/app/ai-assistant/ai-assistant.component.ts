import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';

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

  constructor(private bottomSheetRef: MatBottomSheetRef<AiAssistantComponent>, public router: Router) { }

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
      }, 300);

    }; window.speechSynthesis.speak(utterance);
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
    const text = message.toLowerCase().trim();

    switch (this.currentStep) {

      case 'product':

        // User: "I am looking sandal"
        this.conversationData.product = text;

        this.reply(
          'Sure! Who are you shopping for?',
          ['Men', 'Women', 'Boys', 'Girls']
        );

        this.currentStep = 'category';
        break;


      case 'category':

        // User: "I am a boy"
        this.conversationData.category = text;

        this.reply(
          'What is the age?',
          []
        );

        this.currentStep = 'age';
        break;


      case 'age':

        // User: "20 year"
        this.conversationData.age = text;

        this.reply(
          'What is your budget?',
          ['₹299', '₹499', '₹999', '₹1999']
        );

        this.currentStep = 'budget';
        break;


      case 'budget':

        // User: "500"
        this.conversationData.budget = text;

        this.reply(
          'Great! Searching products...',
          []
        );

        console.log('Conversation Data:', this.conversationData);

        // Product ko subCategory ke roop me use karenge
        const subCategory = this.conversationData.product;

        // Navigation
        this.router.navigate(['/display-item'], {
          queryParams: {
            category: this.conversationData.category,
            subCategory: subCategory,
            age_group: this.conversationData.age,
            product_price: this.conversationData.budget,
            source: 'voice-search'
          }
        }).then(() => {
          this.bottomSheetRef.dismiss();
        });;
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
