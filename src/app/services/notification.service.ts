import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  public notifications$: Observable<Notification[]> = this.notifications.asObservable();

  private defaultDuration = 4000;

  show(type: NotificationType, title: string, message?: string, duration?: number): void {
    const notificationDuration = duration ?? this.defaultDuration;
    const notification: Notification = {
      id: this.generateId(),
      type,
      title,
      message,
      duration: notificationDuration
    };

    const current = this.notifications.value;
    this.notifications.next([...current, notification]);

    if (notificationDuration > 0) {
      setTimeout(() => {
        this.remove(notification.id);
      }, notificationDuration);
    }
  }

  success(title: string, message?: string, duration?: number): void {
    this.show('success', title, message, duration);
  }

  error(title: string, message?: string, duration?: number): void {
    this.show('error', title, message, duration || 6000);
  }

  warning(title: string, message?: string, duration?: number): void {
    this.show('warning', title, message, duration);
  }

  info(title: string, message?: string, duration?: number): void {
    this.show('info', title, message, duration);
  }

  remove(id: string): void {
    const current = this.notifications.value;
    this.notifications.next(current.filter(n => n.id !== id));
  }

  clear(): void {
    this.notifications.next([]);
  }

  private generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

