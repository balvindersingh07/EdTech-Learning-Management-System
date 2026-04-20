/**
 * Observer: domain events notify multiple subscribers when something meaningful happens.
 * Uses Node EventEmitter — decouples assignment workflow from notifications/analytics.
 */
import { EventEmitter } from "events";

export const domainEvents = new EventEmitter();

export const EventNames = {
  ASSIGNMENT_SUBMITTED: "assignment.submitted",
  COURSE_CREATED: "course.created",
};

export function clearAssignmentSubmittedListeners() {
  domainEvents.removeAllListeners(EventNames.ASSIGNMENT_SUBMITTED);
}

export function registerNotificationObserver(store, legacyAdapter) {
  clearAssignmentSubmittedListeners();
  domainEvents.on(EventNames.ASSIGNMENT_SUBMITTED, (payload) => {
    store.notifications.unshift({
      id: `lms-notif-${Date.now()}`,
      title: "New submission",
      body: `${payload.studentName} submitted ${payload.assignmentTitle}`,
      createdAt: new Date().toISOString(),
      read: false,
    });
    legacyAdapter.send({
      to: payload.instructorEmail,
      subject: "New assignment submission",
      body: `${payload.studentName} submitted work for ${payload.assignmentTitle}.`,
    });
  });
}
