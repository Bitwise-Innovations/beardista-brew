export function mapEventFromDb(event) {
  if (!event) return event;

  return {
    ...event,
    startTime: event.start_time,
    endTime: event.end_time,
    imageUrl: event.image_url,
    createdAt: event.created_at,
    isActive: event.is_active,
  };
}

export function mapEventToDb(event) {
  const mapped = {};
  const fields = {
    title: "title",
    description: "description",
    location: "location",
    startTime: "start_time",
    endTime: "end_time",
    capacity: "capacity",
    status: "status",
    imageUrl: "image_url",
    isActive: "is_active",
  };

  for (const [source, target] of Object.entries(fields)) {
    if (Object.hasOwn(event, source)) mapped[target] = event[source];
  }

  for (const field of ["start_time", "end_time", "image_url", "is_active"]) {
    if (Object.hasOwn(event, field)) mapped[field] = event[field];
  }

  return mapped;
}

export function mapEventRegistrationFromDb(registration) {
  if (!registration) return registration;

  return {
    ...registration,
    eventId: registration.event_id,
    userEmail: registration.user_email,
    fullName: registration.full_name,
    verificationCode: registration.verification_code,
    verificationAttempts: registration.verification_attempts,
    verificationExpiresAt: registration.verification_expires_at,
    verificationSentAt: registration.verification_sent_at,
    isVerified: registration.is_verified,
    createdAt: registration.created_at,
  };
}
