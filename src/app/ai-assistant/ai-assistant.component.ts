import {
  Component,
  OnDestroy,
  OnInit,
  NgZone,
  ChangeDetectorRef
} from '@angular/core';

import {
  MatBottomSheetRef
} from '@angular/material/bottom-sheet';

import {
  Router
} from '@angular/router';


@Component({
  selector: 'app-ai-assistant',
  templateUrl: './ai-assistant.component.html',
  styleUrls: ['./ai-assistant.component.scss']
})
export class AiAssistantComponent
  implements OnInit, OnDestroy {


  // =========================================================
  // CHAT
  // =========================================================

  messages: any[] = [];

  isListening = false;

  currentStep = 'product';

  conversationData: any = {};


  // =========================================================
  // BROWSER SPEECH
  // =========================================================

  private recognition: any = null;

  private isRecognitionRunning = false;

  private isRecognitionStarting = false;


  // =========================================================
  // COMMON STATE
  // =========================================================

  private isSpeaking = false;

  private isProcessingResult = false;

  private hasSpeechResult = false;

  private recognitionRetryCount = 0;

  private recognitionRetryTimer: any = null;

  private shouldAutoListen = true;


  // =========================================================
  // ANDROID WEBVIEW
  // =========================================================

  private isAndroidApp = false;


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private bottomSheetRef:
      MatBottomSheetRef<AiAssistantComponent>,

    public router: Router,

    private ngZone: NgZone,

    private cdr: ChangeDetectorRef
  ) { }


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    const android =
      (window as any).Android;


    this.isAndroidApp =
      !!android &&
      typeof android.startListening === 'function';


    console.log(
      '🤖 Android WebView:',
      this.isAndroidApp
    );


    // =======================================================
    // NATIVE SPEECH RESULT
    // =======================================================

    (window as any).onNativeSpeechResult =
      (text: string) => {

        console.log(
          '🎤 Native speech result:',
          text
        );


        /*
         * IMPORTANT:
         *
         * Android WebView callback
         * Angular Zone ke bahar aa sakta hai.
         *
         * Isliye complete UI update
         * NgZone ke andar karna hai.
         */

        this.ngZone.run(() => {

          console.log(
            '🟢 Angular received native result:',
            text
          );


          this.handleNativeSpeechResult(
            text
          );


          this.refreshUI();

        });
      };

    console.log(
      '🔎 CALLBACK CHECK:',
      typeof (window as any).onNativeSpeechResult
    );
    // =======================================================
    // NATIVE SPEECH EVENTS
    // =======================================================

    (window as any).onNativeSpeechEvent =
      (event: string) => {

        console.log(
          '🎤 Native speech event:',
          event
        );


        this.ngZone.run(() => {

          this.handleNativeSpeechEvent(
            event
          );


          this.refreshUI();

        });
      };


    // =======================================================
    // NATIVE TTS EVENTS
    // =======================================================

    (window as any).onNativeTtsEvent =
      (event: string) => {

        console.log(
          '🔊 Native TTS event:',
          event
        );


        this.ngZone.run(() => {

          switch (event) {

            case 'started':

              this.isSpeaking =
                true;

              break;


            case 'finished':

              this.isSpeaking =
                false;

              break;


            case 'error':

              this.isSpeaking =
                false;

              break;
          }


          this.refreshUI();

        });
      };


    this.refreshUI();
  }


  // =========================================================
  // UI REFRESH
  // =========================================================

  private refreshUI(): void {

    /*
     * Create a new array reference.
     *
     * This is important especially when
     * BottomSheet / OnPush change detection
     * is involved.
     */

    this.messages = [
      ...this.messages
    ];


    this.cdr.detectChanges();

    this.cdr.markForCheck();
  }


  // =========================================================
  // DESTROY
  // =========================================================

  ngOnDestroy(): void {

    this.shouldAutoListen = false;


    clearTimeout(
      this.recognitionRetryTimer
    );


    this.recognitionRetryTimer =
      null;


    const android =
      (window as any).Android;


    // =======================================================
    // STOP ANDROID
    // =======================================================

    if (
      this.isAndroidApp &&
      android &&
      typeof android.stopListening === 'function'
    ) {

      try {

        android.stopListening();

      } catch (e) {

        console.log(
          'Android stop error',
          e
        );
      }
    }



    // =======================================================
    // BROWSER RECOGNITION CLEANUP
    // =======================================================

    if (this.recognition) {

      try {

        this.recognition.onstart =
          null;

        this.recognition.onresult =
          null;

        this.recognition.onend =
          null;

        this.recognition.onerror =
          null;

        this.recognition.stop();

      } catch (e) { }
    }
  }


  // =========================================================
  // CLOSE
  // =========================================================

  close(): void {

    this.shouldAutoListen =
      false;

    this.stopListening();

    this.bottomSheetRef.dismiss();
  }


  // =========================================================
  // START CONVERSATION
  // =========================================================

  startConversation(): void {

    console.log(
      '🚀 Starting Ruralx Mitra conversation'
    );


    // IMPORTANT:
    // Purani conversation clear karo

    this.messages = [];


    this.currentStep =
      'product';


    this.conversationData =
      {};


    this.isListening =
      false;


    this.shouldAutoListen =
      true;


    this.isProcessingResult =
      false;


    this.hasSpeechResult =
      false;


    this.recognitionRetryCount =
      0;


    const welcomeMessage =
      "Hello! I'm Ruralx Mitra. What are you looking for today?";


    // =======================================================
    // ADD WELCOME MESSAGE
    // =======================================================

    this.addMessage(
      'ai',
      welcomeMessage
    );


    // =======================================================
    // SPEAK
    // =======================================================

    this.speak(
      welcomeMessage
    );
  }


  // =========================================================
  // ADD MESSAGE
  // =========================================================

  private addMessage(
    sender: string,
    text: string
  ): void {

    if (!text || !text.trim()) {

      return;
    }


    const message = {

      sender: sender,

      text: text.trim()

    };


    console.log(
      '💬 Adding message:',
      message
    );


    this.messages = [
      ...this.messages,
      message
    ];


    this.refreshUI();


    /*
     * Small async refresh.
     *
     * Helps BottomSheet UI when native
     * callback is involved.
     */

    setTimeout(() => {

      this.ngZone.run(() => {

        this.refreshUI();

      });

    }, 0);
  }


  // =========================================================
  // SPEAK
  // =========================================================

  speak(
    text: string
  ): void {

    if (!text || !text.trim()) {

      return;
    }


    this.isSpeaking =
      true;


    // =======================================================
    // ANDROID APP
    // =======================================================

    if (this.isAndroidApp) {

      const android =
        (window as any).Android;


      if (
        !android ||
        typeof android.speak !== 'function'
      ) {

        console.error(
          '❌ Android.speak unavailable'
        );


        this.isSpeaking =
          false;


        this.refreshUI();


        setTimeout(() => {

          if (
            this.shouldAutoListen &&
            !this.isProcessingResult
          ) {

            this.startListening();

          }

        }, 500);


        return;
      }


      try {

        console.log(
          '🔊 Android TTS:',
          text
        );


        /*
         * MainActivity native TTS
         * handle kar raha hai.
         */

        android.speak(
          text
        );

      } catch (e) {

        console.error(
          '❌ Android TTS error',
          e
        );


        this.isSpeaking =
          false;


        this.refreshUI();


        setTimeout(() => {

          if (
            this.shouldAutoListen &&
            !this.isProcessingResult
          ) {

            this.startListening();

          }

        }, 500);
      }


      return;
    }


    // =======================================================
    // BROWSER TTS
    // =======================================================

    if (
      !('speechSynthesis' in window)
    ) {

      this.isSpeaking =
        false;


      this.refreshUI();


      setTimeout(() => {

        if (
          this.shouldAutoListen &&
          !this.isProcessingResult
        ) {

          this.startListening();

        }

      }, 500);


      return;
    }


    try {

      window.speechSynthesis.cancel();

    } catch (e) { }


    const utterance =
      new SpeechSynthesisUtterance(
        text
      );


    utterance.lang =
      'en-IN';


    utterance.rate =
      1;


    utterance.pitch =
      1;


    // =======================================================
    // TTS START
    // =======================================================

    utterance.onstart =
      () => {

        this.ngZone.run(() => {

          this.isSpeaking =
            true;


          this.refreshUI();

        });
      };


    // =======================================================
    // TTS END
    // =======================================================

    utterance.onend =
      () => {

        this.ngZone.run(() => {

          this.isSpeaking =
            false;


          this.refreshUI();


          if (
            !this.shouldAutoListen
          ) {

            return;
          }


          setTimeout(() => {

            this.ngZone.run(() => {

              if (
                !this.isSpeaking &&
                !this.isRecognitionRunning &&
                !this.isRecognitionStarting &&
                !this.isProcessingResult
              ) {

                this.startListening();

              }

            });

          }, 500);

        });
      };


    // =======================================================
    // TTS ERROR
    // =======================================================

    utterance.onerror =
      (event: any) => {

        console.error(
          '❌ Browser TTS error:',
          event
        );


        this.ngZone.run(() => {

          this.isSpeaking =
            false;


          this.refreshUI();


          if (
            !this.shouldAutoListen
          ) {

            return;
          }


          setTimeout(() => {

            this.ngZone.run(() => {

              if (
                !this.isProcessingResult
              ) {

                this.startListening();

              }

            });

          }, 500);

        });
      };


    window.speechSynthesis.speak(
      utterance
    );
  }


  // =========================================================
  // START LISTENING
  // =========================================================

  startListening(): void {

    console.log(
      '🎤 startListening()'
    );


    // =======================================================
    // AUTO LISTENING CHECK
    // =======================================================

    if (
      !this.shouldAutoListen
    ) {

      console.log(
        '🛑 Auto listening disabled'
      );

      return;
    }


    // =======================================================
    // TTS CHECK
    // =======================================================

    if (
      this.isSpeaking
    ) {

      console.log(
        '🔊 AI is speaking'
      );

      return;
    }


    // =======================================================
    // RESULT PROCESSING CHECK
    // =======================================================

    if (
      this.isProcessingResult
    ) {

      console.log(
        '⏳ Result processing'
      );

      return;
    }


    // =======================================================
    // ANDROID WEBVIEW
    // =======================================================

    if (this.isAndroidApp) {

      const android =
        (window as any).Android;


      if (
        !android ||
        typeof android.startListening !== 'function'
      ) {

        console.error(
          '❌ Android.startListening unavailable'
        );

        return;
      }


      if (
        this.isRecognitionRunning ||
        this.isRecognitionStarting
      ) {

        console.log(
          '⚠️ Native recognition already active'
        );

        return;
      }


      this.isRecognitionStarting =
        true;


      this.isListening =
        true;


      this.hasSpeechResult =
        false;


      this.refreshUI();


      console.log(
        '🎤 Calling Android.startListening()'
      );


      try {

        android.startListening();

      } catch (e) {

        console.error(
          '❌ Android.startListening error',
          e
        );


        this.isRecognitionStarting =
          false;

        this.isRecognitionRunning =
          false;

        this.isListening =
          false;


        this.refreshUI();
      }


      return;
    }


    // =======================================================
    // BROWSER SPEECH RECOGNITION
    // =======================================================

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;


    if (!SpeechRecognition) {

      console.error(
        '❌ SpeechRecognition unavailable'
      );

      return;
    }


    if (
      this.isRecognitionRunning ||
      this.isRecognitionStarting
    ) {

      console.log(
        '⚠️ Browser recognition already active'
      );

      return;
    }


    // =======================================================
    // CREATE RECOGNIZER
    // =======================================================

    if (!this.recognition) {

      this.recognition =
        new SpeechRecognition();


      this.recognition.lang =
        'en-IN';


      this.recognition.interimResults =
        false;


      this.recognition.maxAlternatives =
        3;


      // =====================================================
      // BROWSER START
      // =====================================================

      this.recognition.onstart =
        () => {

          this.ngZone.run(() => {

            console.log(
              '🎤 Browser recognition started'
            );


            this.isRecognitionStarting =
              false;


            this.isRecognitionRunning =
              true;


            this.isListening =
              true;


            this.hasSpeechResult =
              false;


            this.refreshUI();

          });
        };


      // =====================================================
      // BROWSER RESULT
      // =====================================================

      this.recognition.onresult =
        (event: any) => {

          this.ngZone.run(() => {

            if (
              this.isProcessingResult
            ) {

              console.log(
                '⚠️ Browser result already processing'
              );

              return;
            }


            const resultIndex =
              event.resultIndex ?? 0;


            const result =
              event.results[
              resultIndex
              ];


            if (
              !result ||
              !result[0]
            ) {

              return;
            }


            const text =
              result[0]
                .transcript
                .trim();


            if (!text) {

              return;
            }


            console.log(
              '🎤 Browser result:',
              text
            );


            this.isProcessingResult =
              true;


            this.hasSpeechResult =
              true;


            this.isRecognitionRunning =
              false;


            this.isRecognitionStarting =
              false;


            this.isListening =
              false;


            this.refreshUI();


            this.handleRecognizedText(
              text
            );

          });
        };


      // =====================================================
      // BROWSER END
      // =====================================================

      this.recognition.onend =
        () => {

          this.ngZone.run(() => {

            console.log(
              '🎤 Browser recognition ended'
            );


            this.isRecognitionRunning =
              false;


            this.isRecognitionStarting =
              false;


            this.isListening =
              false;


            this.refreshUI();


            if (
              this.hasSpeechResult
            ) {

              return;
            }


            if (
              !this.shouldAutoListen
            ) {

              return;
            }


            if (
              this.isSpeaking ||
              this.isProcessingResult
            ) {

              return;
            }


            if (
              this.recognitionRetryCount >= 2
            ) {

              console.log(
                '🛑 Browser recognition retry limit reached'
              );


              this.recognitionRetryCount =
                0;


              return;
            }


            this.recognitionRetryCount++;


            clearTimeout(
              this.recognitionRetryTimer
            );


            this.recognitionRetryTimer =
              setTimeout(() => {

                this.ngZone.run(() => {

                  this.startListening();

                });

              }, 700);

          });
        };


      // =====================================================
      // BROWSER ERROR
      // =====================================================

      this.recognition.onerror =
        (event: any) => {

          this.ngZone.run(() => {

            console.error(
              '❌ Browser speech error:',
              event
            );


            this.isRecognitionRunning =
              false;


            this.isRecognitionStarting =
              false;


            this.isListening =
              false;


            this.refreshUI();


            if (
              event.error ===
              'not-allowed'
            ) {

              return;
            }


            if (
              event.error ===
              'aborted'
            ) {

              return;
            }

          });
        };
    }


    // =======================================================
    // START BROWSER RECOGNITION
    // =======================================================

    try {

      this.isRecognitionStarting =
        true;


      this.isListening =
        true;


      this.hasSpeechResult =
        false;


      this.refreshUI();


      this.recognition.start();

    } catch (e) {

      console.error(
        '❌ Browser recognition start error',
        e
      );


      this.isRecognitionStarting =
        false;


      this.isRecognitionRunning =
        false;


      this.isListening =
        false;


      this.refreshUI();
    }
  }


  // =========================================================
  // NATIVE SPEECH EVENT
  // =========================================================

  private handleNativeSpeechEvent(
    event: string
  ): void {

    switch (event) {

      // =====================================================
      // PERMISSION
      // =====================================================

      case 'permission_granted':

        console.log(
          '🎤 Native permission granted'
        );

        break;


      // =====================================================
      // READY
      // =====================================================

      case 'ready':

        console.log(
          '🎤 Native READY'
        );


        this.isRecognitionStarting =
          false;


        this.isRecognitionRunning =
          true;


        this.isListening =
          true;


        this.refreshUI();

        break;


      // =====================================================
      // STARTED
      // =====================================================

      case 'started':

        console.log(
          '🎤 Native USER SPEECH STARTED'
        );


        this.isRecognitionStarting =
          false;


        this.isRecognitionRunning =
          true;


        this.isListening =
          true;


        this.refreshUI();

        break;


      // =====================================================
      // ENDED
      // =====================================================

      case 'ended':

        console.log(
          '🎤 Native USER SPEECH ENDED - WAITING FOR RESULT'
        );


        /*
         * IMPORTANT:
         *
         * Android onResults() abhi aayega.
         *
         * Yahan recognition ko completely
         * false nahi karna.
         */

        this.isRecognitionRunning =
          true;


        this.isListening =
          true;


        this.refreshUI();

        break;


      // =====================================================
      // STOPPED
      // =====================================================

      case 'stopped':

        console.log(
          '🛑 Native speech stopped'
        );


        this.isRecognitionStarting =
          false;


        this.isRecognitionRunning =
          false;


        this.isListening =
          false;


        this.refreshUI();

        break;


      // =====================================================
      // ERROR
      // =====================================================

      default:

        if (
          event &&
          event.startsWith('error:')
        ) {

          console.error(
            '❌ Native speech:',
            event
          );


          this.isRecognitionStarting =
            false;


          this.isRecognitionRunning =
            false;


          this.isListening =
            false;


          this.refreshUI();
        }

        break;
    }
  }


  // =========================================================
  // NATIVE SPEECH RESULT
  // =========================================================

  private handleNativeSpeechResult(
    text: string
  ): void {

    console.log(
      '🎤 FINAL NATIVE TEXT:',
      text
    );


    // =======================================================
    // STOP LISTENING UI
    // =======================================================

    this.isRecognitionStarting =
      false;


    this.isRecognitionRunning =
      false;


    this.isListening =
      false;


    this.hasSpeechResult =
      true;


    this.refreshUI();


    // =======================================================
    // EMPTY RESULT
    // =======================================================

    const finalText =
      (text || '').trim();


    if (!finalText) {

      console.log(
        '⚠️ Empty native speech result'
      );


      this.isProcessingResult =
        false;


      this.refreshUI();


      return;
    }


    // =======================================================
    // DUPLICATE RESULT PROTECTION
    // =======================================================

    if (
      this.isProcessingResult
    ) {

      console.log(
        '⚠️ Result already processing'
      );


      return;
    }


    this.isProcessingResult =
      true;


    console.log(
      '✅ FINAL TEXT FOR UI:',
      finalText
    );


    // =======================================================
    // HANDLE TEXT
    // =======================================================

    this.handleRecognizedText(
      finalText
    );


    this.refreshUI();
  }


  // =========================================================
  // COMMON RECOGNIZED TEXT
  // =========================================================

  private handleRecognizedText(
    text: string
  ): void {

    const finalText =
      (text || '').trim();


    if (!finalText) {

      return;
    }


    console.log(
      '🎤 USER SAID:',
      finalText
    );


    // =======================================================
    // ADD USER MESSAGE
    // =======================================================

    this.addMessage(
      'user',
      finalText
    );


    console.log(
      '💬 USER MESSAGE ADDED:',
      finalText
    );


    // =======================================================
    // PROCESS MESSAGE
    // =======================================================

    this.processUserMessage(
      finalText
    );


    // =======================================================
    // FORCE UI UPDATE
    // =======================================================

    this.refreshUI();
  }



  // =========================================================
  // BUDGET PARSER
  // =========================================================

  private parseBudget(text: string): number | null {

    if (!text || !text.trim()) {
      return null;
    }

    const value = text
      .toLowerCase()
      .trim()
      .replace(/[₹,]/g, '')
      .replace(/\brupees?\b/g, '')
      .replace(/\brs\.?\b/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const numericMatch = value.match(/\d+(?:\.\d+)?/);

    if (numericMatch) {
      const numberValue = Number(numericMatch[0]);

      if (Number.isFinite(numberValue) && numberValue > 0) {
        return Math.round(numberValue);
      }
    }

    const smallNumbers: { [key: string]: number } = {
      zero: 0, one: 1, two: 2, three: 3, four: 4,
      five: 5, six: 6, seven: 7, eight: 8, nine: 9,
      ten: 10, eleven: 11, twelve: 12, thirteen: 13,
      fourteen: 14, fifteen: 15, sixteen: 16,
      seventeen: 17, eighteen: 18, nineteen: 19
    };

    const tens: { [key: string]: number } = {
      twenty: 20, thirty: 30, forty: 40, fifty: 50,
      sixty: 60, seventy: 70, eighty: 80, ninety: 90
    };

    const ignoredWords = new Set([
      'my', 'budget', 'is', 'around', 'about', 'under',
      'upto', 'up', 'to', 'rupee', 'rupees', 'rs',
      'please', 'maximum', 'max', 'of', 'for'
    ]);

    const words = value
      .replace(/-/g, ' ')
      .split(/\s+/)
      .filter(Boolean)
      .filter(word => !ignoredWords.has(word));

    if (!words.length) {
      return null;
    }

    const thousandIndex = words.indexOf('thousand');

    if (thousandIndex >= 0) {
      let multiplier = 0;

      for (let i = 0; i < thousandIndex; i++) {
        const word = words[i];

        if (smallNumbers[word] !== undefined) {
          multiplier += smallNumbers[word];
        } else if (tens[word] !== undefined) {
          multiplier += tens[word];
        }
      }

      if (multiplier === 0) {
        multiplier = 1;
      }

      let result = multiplier * 1000;

      for (let i = thousandIndex + 1; i < words.length; i++) {
        const word = words[i];

        if (smallNumbers[word] !== undefined) {
          result += smallNumbers[word];
        } else if (tens[word] !== undefined) {
          result += tens[word];
        } else if (word === 'hundred') {
          result += 100;
        }
      }

      return result > 0 ? result : null;
    }

    const hundredIndex = words.indexOf('hundred');

    if (hundredIndex >= 0) {
      let multiplier = 0;

      for (let i = 0; i < hundredIndex; i++) {
        const word = words[i];

        if (smallNumbers[word] !== undefined) {
          multiplier += smallNumbers[word];
        } else if (tens[word] !== undefined) {
          multiplier += tens[word];
        }
      }

      if (multiplier === 0) {
        multiplier = 1;
      }

      let result = multiplier * 100;

      for (let i = hundredIndex + 1; i < words.length; i++) {
        const word = words[i];

        if (smallNumbers[word] !== undefined) {
          result += smallNumbers[word];
        } else if (tens[word] !== undefined) {
          result += tens[word];
        }
      }

      return result > 0 ? result : null;
    }

    let normalValue = 0;

    for (const word of words) {
      if (smallNumbers[word] !== undefined) {
        normalValue += smallNumbers[word];
      } else if (tens[word] !== undefined) {
        normalValue += tens[word];
      }
    }

    return normalValue > 0 ? normalValue : null;
  }


  // =========================================================
  // PROCESS USER MESSAGE
  // =========================================================

  processUserMessage(
    message: string
  ): void {

    const text =
      message
        .toLowerCase()
        .trim();


    console.log(
      '⚙️ Processing:',
      text,
      'Step:',
      this.currentStep
    );


    switch (
    this.currentStep
    ) {


      // =====================================================
      // PRODUCT
      // =====================================================

      case 'product':

        this.conversationData.product =
          text;


        this.currentStep =
          'category';


        this.reply(
          'Sure! Who are you shopping for? Men, Women, Boys, Girls, or Kids?'
        );

        break;


      // =====================================================
      // CATEGORY
      // =====================================================

      case 'category':

        this.conversationData.category =
          text;


        this.currentStep =
          'age';


        this.reply(
          'What is the age? Please say an age in years, for example twenty years, or say adult if you are shopping for an adult.'
        ); break;


      // =====================================================
      // AGE
      // =====================================================

      case 'age':

        this.conversationData.age =
          text;


        this.currentStep =
          'budget';


        this.reply(
          'What is your budget? Please say the amount in rupees, for example five hundred rupees, nine hundred rupees, or one thousand rupees.'
        );

        break;


      // =====================================================
      // BUDGET
      // =====================================================

      case 'budget': {

        console.log(
          '💰 RAW BUDGET:',
          message
        );

        const budget =
          this.parseBudget(message);

        console.log(
          '💰 PARSED BUDGET:',
          budget
        );

        if (
          budget === null ||
          budget <= 0
        ) {

          this.isProcessingResult =
            false;

          this.reply(
            "I couldn't understand the budget. Please say the amount in rupees, for example six hundred rupees, nine hundred rupees, or one thousand rupees."
          );

          this.refreshUI();

          return;
        }
        // =====================================================
        // MINIMUM BUDGET
        // =====================================================

        if (budget < 200) {

          this.isProcessingResult = false;

          this.reply(
            "Please increase your budget to at least 200 rupees."
          );

          this.refreshUI();

          return;
        }
        this.conversationData.budget =
          budget;

        console.log(
          '💰 FINAL BUDGET:',
          this.conversationData.budget
        );

        this.shouldAutoListen =
          false;

        this.stopListening();

        this.reply(
          `Great! Searching products under ₹${budget}...`
        );

        const subCategory =
          this.conversationData.product;

        setTimeout(() => {

          this.ngZone.run(() => {

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
                    budget,

                  source:
                    'voice-search'

                }
              }
            ).then(() => {

              this.ngZone.run(() => {

                this.bottomSheetRef.dismiss();

                this.refreshUI();

              });

            });

          });

        }, 1800);

        break;
      }
    }


    /*
     * IMPORTANT:
     *
     * Result ko immediately unlock mat karo.
     *
     * Agar Android same result callback
     * dobara bhej de to duplicate message
     * aa sakta hai.
     *
     * TTS start ho chuka hai, isliye
     * thoda delay safe hai.
     */

    setTimeout(() => {

      this.ngZone.run(() => {

        this.isProcessingResult =
          false;


        this.refreshUI();

      });

    }, 200);
  }


  // =========================================================
  // REPLY
  // =========================================================

  reply(
    text: string
  ): void {

    if (!text || !text.trim()) {

      return;
    }


    console.log(
      '🤖 AI REPLY:',
      text
    );


    // =======================================================
    // ADD AI MESSAGE
    // =======================================================

    this.addMessage(
      'ai',
      text
    );


    // =======================================================
    // SPEAK
    // =======================================================

    this.speak(
      text
    );


    this.refreshUI();
  }


  // =========================================================
  // STOP LISTENING
  // =========================================================

  stopListening(): void {

    console.log(
      '🛑 Angular stopListening()'
    );


    // =======================================================
    // CLEAR RETRY
    // =======================================================

    clearTimeout(
      this.recognitionRetryTimer
    );


    this.recognitionRetryTimer =
      null;


    // =======================================================
    // STATE RESET
    // =======================================================

    this.isRecognitionRunning =
      false;


    this.isRecognitionStarting =
      false;


    this.isListening =
      false;


    this.recognitionRetryCount =
      0;


    this.refreshUI();


    // =======================================================
    // ANDROID
    // =======================================================

    if (this.isAndroidApp) {

      const android =
        (window as any).Android;


      if (
        android &&
        typeof android.stopListening === 'function'
      ) {

        try {

          android.stopListening();

        } catch (e) {

          console.error(
            '❌ Android stop error',
            e
          );
        }
      }


      this.refreshUI();

      return;
    }


    // =======================================================
    // BROWSER
    // =======================================================

    if (this.recognition) {

      try {

        this.recognition.stop();

      } catch (e) { }
    }


    this.refreshUI();
  }
}