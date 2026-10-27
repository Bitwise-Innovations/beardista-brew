export function mapReviewFromDb(review) {
  if (!review) return review;

  return {
    ...review,
    comment: review.comment ?? review.quote,
    customerName: review.customer_name ?? review.author,
    isPublished: review.is_published ?? review.status === "approved",
    createdAt: review.created_at,
  };
}

export function mapReviewToDb(review) {
  const mapped = {};
  if (Object.hasOwn(review, "rating")) mapped.rating = review.rating;
  if (Object.hasOwn(review, "comment") || Object.hasOwn(review, "quote")) {
    const comment = Object.hasOwn(review, "comment")
      ? review.comment
      : review.quote;
    mapped.comment = comment;
    mapped.quote = comment;
  }
  if (Object.hasOwn(review, "customerName") || Object.hasOwn(review, "author")) {
    const customerName = Object.hasOwn(review, "customerName")
      ? review.customerName
      : review.author;
    mapped.customer_name = customerName;
    mapped.author = customerName;
  }
  if (Object.hasOwn(review, "isPublished")) {
    mapped.is_published = review.isPublished;
  }
  return mapped;
}

export function mapSurveyFromDb(survey) {
  if (!survey) return survey;

  return {
    ...survey,
    isActive: survey.is_active,
    createdAt: survey.created_at,
  };
}

export function mapSurveyResponseFromDb(response) {
  if (!response) return response;

  return {
    ...response,
    surveyId: response.survey_id,
    createdAt: response.created_at,
  };
}

export function mapDashboardAnalyticsFromDb(analytics) {
  const row = Array.isArray(analytics) ? analytics[0] : analytics;
  if (!row) return row;

  return {
    totalSales: row.total_sales,
    activeMenuItemsCount: row.active_menu_items_count,
    upcomingEventsCount: row.upcoming_events_count,
    averageRating: row.average_rating,
  };
}
