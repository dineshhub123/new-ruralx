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
  private recognition: any = null;
  private isRecognitionRunning = false;
  private isRecognitionStarting = false;
  private isSpeaking = false;
  private isProcessingResult = false;
  private hasSpeechResult = false;
  private recognitionRetryCount = 0;
  private recognitionRetryTimer: any = null;
  private shouldAutoListen = true;
  constructor(private bottomSheetRef: MatBottomSheetRef<AiAssistantComponent>, public router: Router) { }

  close() {
    this.bottomSheetRef.dismiss();
  }

  startConversation() {
    this.currentStep = 'product';
    this.conversationData = {};
    this.isListening = false;

    const welcomeMessage = "Hello! I'm Ruralx Mitra. What are you looking for today?";

    this.messages.push({
      sender: 'ai',
      text: welcomeMessage
    });

    this.speak(welcomeMessage);
  }

  speak(text: string) {
    if (!('speechSynthesis' in window)) {
      setTimeout(() => {
        this.startListening();
      }, 500);
      return;
    }

    // Stop previous speech
    window.speechSynthesis.cancel();
    this.isSpeaking = true;
    const utterance =
      new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 1;
    utterance.pitch = 1;

    // --------------------------------
    // SPEECH END
    // --------------------------------
    utterance.onend = () => {
      this.isSpeaking = false;
      // Give mobile Chrome some time
      setTimeout(() => {
        if (!this.shouldAutoListen) {
          return;
        }
        if (!this.isSpeaking &&
          !this.isRecognitionRunning &&
          !this.isRecognitionStarting && !this.isProcessingResult) {
          this.startListening();
        }

      }, 500);
    };

    // --------------------------------
    // SPEECH ERROR
    // --------------------------------

    utterance.onerror = (event: any) => {
      this.isSpeaking = false;
      if (!this.shouldAutoListen) {
        return;
      }
      setTimeout(() => {

        if (!this.isRecognitionRunning &&
          !this.isRecognitionStarting) {

          this.startListening();
        }

      }, 500);
    };


    // --------------------------------
    // SPEAK
    // --------------------------------

    window.speechSynthesis.speak(utterance);
  }


  startListening() {

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    // Already active
    if (
      this.isRecognitionRunning ||
      this.isRecognitionStarting
    ) {
      return;
    }

    // AI is speaking
    if (this.isSpeaking) {
      return;
    }

    // Result is being processed
    if (this.isProcessingResult) {
      return;
    }

    // Create recognition only once
    if (!this.recognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-IN';
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;
      // =====================================
      // START
      // =====================================

      this.recognition.onstart = () => {
        this.isRecognitionStarting = false;
        this.isRecognitionRunning = true;
        this.isListening = true;
        // New session
        this.hasSpeechResult = false;
      };


      // =====================================
      // RESULT
      // =====================================

      this.recognition.onresult = (event: any) => {
        if (this.isProcessingResult) {
          return;
        }
        this.isProcessingResult = true;
        this.hasSpeechResult = true;
        // Successful speech received
        this.recognitionRetryCount = 0;
        const resultIndex =
          event.resultIndex ?? 0;
        const result =
          event.results[resultIndex];
        if (
          !result ||
          !result[0]
        ) {
          this.isProcessingResult = false;
          return;
        }
        const text =
          result[0].transcript
            .trim();
        this.isRecognitionRunning = false;
        this.isRecognitionStarting = false;
        this.isListening = false;


        if (!text) {

          this.isProcessingResult = false;

          return;
        }


        this.messages.push({
          sender: 'user',
          text: text
        });


        this.processUserMessage(text);


        // Unlock after processing
        setTimeout(() => {

          this.isProcessingResult = false;

        }, 500);
      };


      // =====================================
      // END
      // =====================================

      this.recognition.onend = () => {
        this.isRecognitionRunning = false;
        this.isRecognitionStarting = false;
        this.isListening = false;


        // -----------------------------------
        // RESULT MILA THA
        // -----------------------------------

        if (this.hasSpeechResult) {
          return;
        }


        // -----------------------------------
        // NO RESULT
        // -----------------------------------
        // Don't retry forever
        if (this.recognitionRetryCount >= 2) {
          this.recognitionRetryCount = 0;
          return;
        }


        // Don't retry while AI is speaking
        if (this.isSpeaking) {
          return;
        }


        // Don't retry while processing
        if (this.isProcessingResult) {
          return;
        }
        this.recognitionRetryCount++;
        // Small delay for mobile Chrome
        clearTimeout(
          this.recognitionRetryTimer
        );


        this.recognitionRetryTimer =
          setTimeout(() => {
            if (
              !this.isSpeaking &&
              !this.isRecognitionRunning &&
              !this.isRecognitionStarting &&
              !this.isProcessingResult
            ) {

              this.startListening();
            }

          }, 700);
      };


      // =====================================
      // ERROR
      // =====================================

      this.recognition.onerror = (event: any) => {
        this.isRecognitionRunning = false;
        this.isRecognitionStarting = false;
        this.isListening = false;


        if (event.error === 'no-speech') {
          return;
        }

        if (event.error === 'aborted') {
          return;
        }


        if (event.error === 'not-allowed') {
          return;
        }

      };
    }


    // =====================================
    // START RECOGNITION
    // =====================================

    try {
      this.isRecognitionStarting = true;
      this.recognition.start();
    } catch (error) {

      this.isRecognitionStarting = false;
      this.isRecognitionRunning = false;
      this.isListening = false;
    }
  }

  processUserMessage(message: string) {

    const text = message.toLowerCase().trim();

    switch (this.currentStep) {

      case 'product':

        this.conversationData.product = text;

        this.reply(
          'Sure! Who are you shopping for? (Men, Women, Boys, Girls, or Kids)'
        );

        this.currentStep = 'category';

        break;


      case 'category':

        this.conversationData.category = text;

        this.reply(
          'What is the age?'
        );

        this.currentStep = 'age';

        break;


      case 'age':

        this.conversationData.age = text;

        this.reply(
          'What is your budget? (₹300, ₹500, ₹1000, ₹2000)'
        );

        this.currentStep = 'budget';

        break;


      case 'budget':

        this.conversationData.budget = text;
        // --------------------------------
        // IMPORTANT:
        // DO NOT START LISTENING AGAIN
        // --------------------------------

        this.shouldAutoListen = false;


        // Stop current recognition
        this.stopListening();


        // --------------------------------
        // AI FINAL MESSAGE
        // --------------------------------

        this.reply(
          'Great! Searching products...'
        );

        const subCategory =
          this.conversationData.product;

        this.router.navigate(
          ['/display-item'],
          {
            queryParams: {

              category:
                this.conversationData.category,

              subCategory:
                subCategory,

              age_group:
                this.conversationData.age,

              product_price:
                this.conversationData.budget,

              source:
                'voice-search'
            }
          }
        ).then(() => {

          this.bottomSheetRef.dismiss();

        });

        break;
    }
  }

  reply(text: string) {
    this.messages.push({
      sender: 'ai',
      text: text,
    });

    this.speak(text);
  }
  stopListening() {
    // Auto retry timer cancel
    if (this.recognitionRetryTimer) {
      clearTimeout(this.recognitionRetryTimer);
      this.recognitionRetryTimer = null;
    }

    // Reset flags
    this.isRecognitionRunning = false;
    this.isRecognitionStarting = false;
    this.isListening = false;
    this.isProcessingResult = false;

    this.hasSpeechResult = true;
    this.recognitionRetryCount = 0;

    // Stop microphone
    if (this.recognition) {

      try {
        this.recognition.stop();
      } catch (error) {
        console.log(
          'Recognition already stopped'
        );
      }
    }
  }
}
