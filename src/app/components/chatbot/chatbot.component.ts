import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  typing?: boolean;
}

export interface QuickReply {
  text: string;
  action: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatMenuModule,
    MatSlideToggleModule
  ],
  template: `
    <div class="chatbot-container fade-in">
      <!-- Header -->
      <div class="chatbot-header">
        <h1 class="chatbot-title">
          <mat-icon class="title-icon">smart_toy</mat-icon>
          AI Assistant
        </h1>
        <p class="chatbot-subtitle">Your intelligent virtual assistant powered by advanced AI</p>
      </div>

      <div class="chat-layout">
        <!-- Chat Interface -->
        <mat-card class="chat-card">
          <!-- Chat Header -->
          <div class="chat-header">
            <div class="bot-avatar">
              <mat-icon>psychology</mat-icon>
            </div>
            <div class="bot-info">
              <h3 class="bot-name">AI Assistant</h3>
              <p class="bot-status" [class.online]="isOnline">{{ isOnline ? 'Online' : 'Offline' }}</p>
            </div>
            <div class="chat-actions">
              <button mat-icon-button [matMenuTriggerFor]="chatMenu" matTooltip="Chat Options">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #chatMenu="matMenu">
                <button mat-menu-item (click)="clearChat()">
                  <mat-icon>clear_all</mat-icon>
                  <span>Clear Chat</span>
                </button>
                <button mat-menu-item (click)="exportChat()">
                  <mat-icon>download</mat-icon>
                  <span>Export Chat</span>
                </button>
                <mat-divider></mat-divider>
                <button mat-menu-item (click)="toggleBotMode()">
                  <mat-icon>{{ smartMode ? 'psychology_alt' : 'psychology' }}</mat-icon>
                  <span>{{ smartMode ? 'Standard Mode' : 'Smart Mode' }}</span>
                </button>
              </mat-menu>
            </div>
          </div>

          <mat-divider></mat-divider>

          <!-- Messages Area -->
          <div class="messages-container" #messagesContainer>
            <div class="messages-wrapper">
              <!-- Welcome Message -->
              <div *ngIf="messages.length === 0" class="welcome-message">
                <div class="welcome-content">
                  <mat-icon class="welcome-icon">waving_hand</mat-icon>
                  <h3>Welcome to AI Assistant!</h3>
                  <p>I'm here to help you with any questions or tasks. You can ask me about:</p>
                  <ul>
                    <li>General information and explanations</li>
                    <li>Technical assistance</li>
                    <li>Data analysis and insights</li>
                    <li>Creative writing and brainstorming</li>
                    <li>Problem-solving strategies</li>
                  </ul>
                  <p>Try one of the suggested prompts below or type your own message!</p>
                </div>
              </div>

              <!-- Chat Messages -->
              <div *ngFor="let message of messages; trackBy: trackByMessage" 
                   class="message-wrapper"
                   [class.user-message]="message.sender === 'user'"
                   [class.bot-message]="message.sender === 'bot'">
                
                <div class="message-avatar" *ngIf="message.sender === 'bot'">
                  <mat-icon>psychology</mat-icon>
                </div>

                <div class="message-content">
                  <div class="message-bubble">
                    <div *ngIf="message.typing" class="typing-indicator">
                      <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                    <div *ngIf="!message.typing" class="message-text">{{ message.text }}</div>
                  </div>
                  <div class="message-timestamp">
                    {{ formatTimestamp(message.timestamp) }}
                  </div>
                </div>

                <div class="message-avatar" *ngIf="message.sender === 'user'">
                  <mat-icon>person</mat-icon>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Replies -->
          <div *ngIf="quickReplies.length > 0" class="quick-replies">
            <mat-chip-listbox>
              <mat-chip-option 
                *ngFor="let reply of quickReplies" 
                (click)="sendQuickReply(reply)"
                class="quick-reply-chip">
                {{ reply.text }}
              </mat-chip-option>
            </mat-chip-listbox>
          </div>

          <mat-divider></mat-divider>

          <!-- Input Area -->
          <div class="input-area">
            <form [formGroup]="messageForm" (ngSubmit)="sendMessage()" class="message-form">
              <mat-form-field appearance="outline" class="message-input">
                <input 
                  matInput 
                  formControlName="message"
                  placeholder="Type your message..."
                  [disabled]="isTyping"
                  (keydown.enter)="handleEnterKey($event)"
                  #messageInput>
                <mat-hint>Press Enter to send, Shift+Enter for new line</mat-hint>
              </mat-form-field>
              
              <div class="input-actions">
                <button 
                  mat-icon-button 
                  type="button"
                  matTooltip="Attach File"
                  [disabled]="isTyping">
                  <mat-icon>attach_file</mat-icon>
                </button>
                <button 
                  mat-icon-button 
                  type="button"
                  matTooltip="Voice Input"
                  [disabled]="isTyping">
                  <mat-icon>mic</mat-icon>
                </button>
                <button 
                  mat-raised-button 
                  color="primary"
                  type="submit"
                  [disabled]="!messageForm.valid || isTyping"
                  class="send-button">
                  <mat-spinner *ngIf="isTyping" diameter="20"></mat-spinner>
                  <mat-icon *ngIf="!isTyping">send</mat-icon>
                </button>
              </div>
            </form>
          </div>
        </mat-card>

        <!-- Sidebar -->
        <div class="chat-sidebar">
          <!-- AI Features -->
          <mat-card class="feature-card">
            <mat-card-header>
              <mat-card-title>AI Features</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="feature-list">
                <div class="feature-item" [class.active]="smartMode">
                  <mat-icon>psychology</mat-icon>
                  <div class="feature-info">
                    <div class="feature-name">Smart Mode</div>
                    <div class="feature-desc">Enhanced AI responses</div>
                  </div>
                  <mat-slide-toggle 
                    [(ngModel)]="smartMode" 
                    (change)="toggleBotMode()">
                  </mat-slide-toggle>
                </div>
                
                <div class="feature-item">
                  <mat-icon>translate</mat-icon>
                  <div class="feature-info">
                    <div class="feature-name">Multi-language</div>
                    <div class="feature-desc">Support for 50+ languages</div>
                  </div>
                </div>
                
                <div class="feature-item">
                  <mat-icon>memory</mat-icon>
                  <div class="feature-info">
                    <div class="feature-name">Context Memory</div>
                    <div class="feature-desc">Remembers conversation context</div>
                  </div>
                </div>
                
                <div class="feature-item">
                  <mat-icon>code</mat-icon>
                  <div class="feature-info">
                    <div class="feature-name">Code Assistant</div>
                    <div class="feature-desc">Programming help & debugging</div>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Suggested Prompts -->
          <mat-card class="prompts-card">
            <mat-card-header>
              <mat-card-title>Suggested Prompts</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="prompt-list">
                <button 
                  *ngFor="let prompt of suggestedPrompts" 
                  mat-stroked-button 
                  class="prompt-button"
                  (click)="sendPrompt(prompt)">
                  {{ prompt }}
                </button>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Chat Statistics -->
          <mat-card class="stats-card">
            <mat-card-header>
              <mat-card-title>Chat Statistics</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="stats-list">
                <div class="stat-item">
                  <mat-icon>chat</mat-icon>
                  <div class="stat-info">
                    <div class="stat-value">{{ totalMessages }}</div>
                    <div class="stat-label">Messages</div>
                  </div>
                </div>
                <div class="stat-item">
                  <mat-icon>schedule</mat-icon>
                  <div class="stat-info">
                    <div class="stat-value">{{ sessionDuration }}m</div>
                    <div class="stat-label">Session</div>
                  </div>
                </div>
                <div class="stat-item">
                  <mat-icon>speed</mat-icon>
                  <div class="stat-info">
                    <div class="stat-value">{{ averageResponseTime }}s</div>
                    <div class="stat-label">Avg Response</div>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chatbot-container {
      max-width: 1400px;
      margin: 0 auto;
      height: calc(100vh - 200px);
      display: flex;
      flex-direction: column;
    }

    .chatbot-header {
      margin-bottom: 24px;
    }

    .chatbot-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 2rem;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: var(--text-primary);
    }

    .title-icon {
      color: #8b5cf6;
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .chatbot-subtitle {
      color: var(--text-secondary);
      margin: 0;
      font-size: 1rem;
    }

    .chat-layout {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 24px;
      height: 100%;
      min-height: 600px;
    }

    .chat-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      border-radius: 16px;
      overflow: hidden;
    }

    .chat-header {
      display: flex;
      align-items: center;
      padding: 20px;
      gap: 16px;
      background-color: var(--bg-secondary);
    }

    .bot-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #8b5cf6, #3b82f6);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
    }

    .bot-info {
      flex: 1;
    }

    .bot-name {
      margin: 0 0 4px 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .bot-status {
      margin: 0;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .bot-status.online {
      color: #10b981;
    }

    .messages-container {
      flex: 1;
      overflow-y: auto;
      padding: 0;
      max-height: 400px;
    }

    .messages-wrapper {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .welcome-message {
      text-align: center;
      padding: 40px 20px;
      color: var(--text-secondary);
    }

    .welcome-content {
      max-width: 500px;
      margin: 0 auto;
    }

    .welcome-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #8b5cf6;
      margin-bottom: 16px;
    }

    .welcome-content h3 {
      color: var(--text-primary);
      margin-bottom: 16px;
    }

    .welcome-content ul {
      text-align: left;
      margin: 16px 0;
    }

    .message-wrapper {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
    }

    .message-wrapper.user-message {
      flex-direction: row-reverse;
    }

    .message-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
    }

    .message-wrapper.bot-message .message-avatar {
      background: linear-gradient(135deg, #8b5cf6, #3b82f6);
      color: white;
    }

    .message-wrapper.user-message .message-avatar {
      background-color: var(--bg-secondary);
      color: var(--text-primary);
    }

    .message-content {
      max-width: 70%;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .message-wrapper.user-message .message-content {
      align-items: flex-end;
    }

    .message-bubble {
      padding: 12px 16px;
      border-radius: 18px;
      word-wrap: break-word;
    }

    .message-wrapper.bot-message .message-bubble {
      background-color: var(--bg-secondary);
      color: var(--text-primary);
      border-bottom-left-radius: 6px;
    }

    .message-wrapper.user-message .message-bubble {
      background-color: #3b82f6;
      color: white;
      border-bottom-right-radius: 6px;
    }

    .message-text {
      line-height: 1.5;
    }

    .message-timestamp {
      font-size: 0.75rem;
      color: var(--text-secondary);
      padding: 0 4px;
    }

    .typing-indicator {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .typing-dots {
      display: flex;
      gap: 4px;
    }

    .typing-dots span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: var(--text-secondary);
      animation: typing 1.4s infinite ease-in-out;
    }

    .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
    .typing-dots span:nth-child(2) { animation-delay: -0.16s; }

    @keyframes typing {
      0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
      40% { transform: scale(1); opacity: 1; }
    }

    .quick-replies {
      padding: 16px 20px;
      border-top: 1px solid var(--border-color);
    }

    .quick-reply-chip {
      margin: 4px;
      cursor: pointer;
    }

    .input-area {
      padding: 20px;
      border-top: 1px solid var(--border-color);
    }

    .message-form {
      display: flex;
      gap: 12px;
      align-items: flex-end;
    }

    .message-input {
      flex: 1;
    }

    .input-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .send-button {
      min-width: 48px;
      height: 48px;
      border-radius: 50%;
    }

    /* Sidebar */
    .chat-sidebar {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .feature-card,
    .prompts-card,
    .stats-card {
      border-radius: 12px;
    }

    .feature-list,
    .stats-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .feature-item,
    .stat-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .feature-item.active {
      color: #8b5cf6;
    }

    .feature-info,
    .stat-info {
      flex: 1;
    }

    .feature-name,
    .stat-value {
      font-weight: 500;
      color: var(--text-primary);
    }

    .feature-desc,
    .stat-label {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .prompt-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .prompt-button {
      text-align: left;
      justify-content: flex-start;
      white-space: normal;
      line-height: 1.4;
      padding: 12px;
      min-height: auto;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .chat-layout {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .chat-sidebar {
        order: -1;
      }

      .feature-list {
        flex-direction: row;
        flex-wrap: wrap;
      }

      .feature-item {
        flex: 1;
        min-width: 200px;
      }
    }

    @media (max-width: 768px) {
      .chatbot-title {
        font-size: 1.5rem;
      }

      .chat-header {
        padding: 16px;
      }

      .messages-wrapper {
        padding: 16px;
      }

      .message-content {
        max-width: 85%;
      }

      .input-area {
        padding: 16px;
      }

      .message-form {
        flex-direction: column;
        gap: 12px;
      }

      .input-actions {
        justify-content: space-between;
        width: 100%;
      }
    }

    /* Animation */
    .fade-in {
      animation: fadeIn 0.6s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  messageForm: FormGroup;
  messages: ChatMessage[] = [];
  quickReplies: QuickReply[] = [];
  isTyping = false;
  isOnline = true;
  smartMode = true;
  sessionStartTime = new Date();

  suggestedPrompts = [
    "Explain quantum computing in simple terms",
    "Help me debug this JavaScript code",
    "Write a creative story about space exploration",
    "Analyze the pros and cons of remote work",
    "Generate ideas for a mobile app",
    "Explain machine learning algorithms"
  ];

  // Mock AI responses
  private aiResponses = [
    "I understand your question. Let me help you with that.",
    "That's an interesting topic! Here's what I think about it...",
    "Based on my knowledge, I can provide you with the following insights:",
    "Great question! This is a complex topic that involves several factors:",
    "I'd be happy to help you understand this concept better.",
    "Let me break this down for you step by step:",
    "That's a common question, and there are several approaches to consider:",
    "From my perspective, here are the key points you should know:"
  ];

  constructor(private fb: FormBuilder) {
    this.messageForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit() {
    this.initializeQuickReplies();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private initializeQuickReplies() {
    this.quickReplies = [
      { text: "Tell me a joke", action: "joke" },
      { text: "What can you help me with?", action: "help" },
      { text: "Explain AI to me", action: "ai_explanation" },
      { text: "What's the weather like?", action: "weather" }
    ];
  }

  trackByMessage(index: number, message: ChatMessage): string {
    return message.id;
  }

  formatTimestamp(timestamp: Date): string {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  handleEnterKey(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage() {
    if (this.messageForm.valid && !this.isTyping) {
      const messageText = this.messageForm.value.message.trim();
      
      if (messageText) {
        this.addUserMessage(messageText);
        this.messageForm.reset();
        this.simulateAIResponse(messageText);
      }
    }
  }

  sendQuickReply(reply: QuickReply) {
    this.addUserMessage(reply.text);
    this.simulateAIResponse(reply.text, reply.action);
    this.quickReplies = []; // Clear quick replies after use
  }

  sendPrompt(prompt: string) {
    this.messageForm.patchValue({ message: prompt });
    this.messageInput.nativeElement.focus();
  }

  private addUserMessage(text: string) {
    const message: ChatMessage = {
      id: this.generateMessageId(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    this.messages.push(message);
  }

  private addBotMessage(text: string) {
    const message: ChatMessage = {
      id: this.generateMessageId(),
      text,
      sender: 'bot',
      timestamp: new Date()
    };
    this.messages.push(message);
  }

  private simulateAIResponse(userMessage: string, action?: string) {
    this.isTyping = true;
    
    // Add typing indicator
    const typingMessage: ChatMessage = {
      id: 'typing',
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      typing: true
    };
    this.messages.push(typingMessage);

    // Simulate AI processing time
    setTimeout(() => {
      // Remove typing indicator
      this.messages = this.messages.filter(m => m.id !== 'typing');
      
      let response = '';
      
      if (action) {
        response = this.getActionResponse(action);
      } else {
        response = this.generateContextualResponse(userMessage);
      }
      
      this.addBotMessage(response);
      this.isTyping = false;
      
      // Sometimes add quick replies
      if (Math.random() > 0.7) {
        this.addRandomQuickReplies();
      }
    }, 1000 + Math.random() * 2000); // Random delay 1-3 seconds
  }

  private getActionResponse(action: string): string {
    switch (action) {
      case 'joke':
        return "Why don't scientists trust atoms? Because they make up everything! 😄";
      case 'help':
        return "I can help you with a wide variety of tasks including answering questions, writing content, code assistance, data analysis, creative projects, and much more. What would you like to explore?";
      case 'ai_explanation':
        return "AI (Artificial Intelligence) refers to computer systems that can perform tasks that typically require human intelligence. This includes learning, reasoning, problem-solving, and understanding language. I'm an example of AI designed to be helpful, harmless, and honest in my interactions!";
      case 'weather':
        return "I don't have access to real-time weather data, but I'd recommend checking a reliable weather service like Weather.com or your local meteorological service for current conditions in your area.";
      default:
        return this.getRandomResponse();
    }
  }

  private generateContextualResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! It's great to meet you. How can I assist you today?";
    } else if (lowerMessage.includes('code') || lowerMessage.includes('programming')) {
      return "I'd be happy to help with programming! I can assist with debugging, explaining concepts, writing code examples, or discussing best practices. What specific coding challenge are you working on?";
    } else if (lowerMessage.includes('explain') || lowerMessage.includes('what is')) {
      return "I love explaining concepts! I'll do my best to break down complex topics into understandable parts. Could you be more specific about what you'd like me to explain?";
    } else if (lowerMessage.includes('help') || lowerMessage.includes('assist')) {
      return "I'm here to help! I can assist with a wide range of topics including research, writing, problem-solving, creative projects, technical questions, and much more. What do you need help with?";
    } else {
      return this.getRandomResponse() + " " + this.generateDetailedResponse(userMessage);
    }
  }

  private getRandomResponse(): string {
    return this.aiResponses[Math.floor(Math.random() * this.aiResponses.length)];
  }

  private generateDetailedResponse(userMessage: string): string {
    const responses = [
      `Regarding "${userMessage}", this is a fascinating topic that involves multiple perspectives and considerations.`,
      `Your question about "${userMessage}" touches on some important concepts that I'd be happy to explore with you.`,
      `I notice you're asking about "${userMessage}". This is an area where there's a lot to discuss and analyze.`,
      `When it comes to "${userMessage}", there are several key factors we should consider together.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private addRandomQuickReplies() {
    const allReplies = [
      { text: "Tell me more", action: "more_info" },
      { text: "Can you give an example?", action: "example" },
      { text: "What else should I know?", action: "additional_info" },
      { text: "How does this work?", action: "how_it_works" }
    ];
    
    // Select 2-3 random quick replies
    const numReplies = Math.floor(Math.random() * 2) + 2;
    this.quickReplies = allReplies
      .sort(() => Math.random() - 0.5)
      .slice(0, numReplies);
  }

  private generateMessageId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private scrollToBottom() {
    try {
      const container = this.messagesContainer?.nativeElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  clearChat() {
    this.messages = [];
    this.quickReplies = [];
    this.initializeQuickReplies();
  }

  exportChat() {
    const chatData = {
      timestamp: new Date().toISOString(),
      messages: this.messages.filter(m => !m.typing),
      totalMessages: this.totalMessages,
      sessionDuration: this.sessionDuration
    };
    
    const dataStr = JSON.stringify(chatData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  toggleBotMode() {
    this.smartMode = !this.smartMode;
    const message = this.smartMode 
      ? "Smart mode activated! I'll provide more detailed and context-aware responses."
      : "Standard mode activated. I'll provide concise and direct responses.";
    
    this.addBotMessage(message);
  }

  get totalMessages(): number {
    return this.messages.filter(m => !m.typing).length;
  }

  get sessionDuration(): number {
    return Math.floor((new Date().getTime() - this.sessionStartTime.getTime()) / 60000);
  }

  get averageResponseTime(): number {
    // Mock calculation - in real app, you'd track actual response times
    return Math.floor(Math.random() * 3) + 1;
  }
}