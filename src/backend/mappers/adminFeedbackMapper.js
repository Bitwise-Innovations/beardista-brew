const RATING_SCORES = { "Very Poor": 1, Poor: 2, Average: 3, Good: 4, Excellent: 5 };

export function toAdminResponse(row) {
  const answers = row.answers ?? {};
  const rating =
    typeof answers.rating === "number" ? answers.rating : RATING_SCORES[answers.rating] ?? 0;
  const highlight = answers.orderHighlight?.trim() ?? "";

  return {
    id: row.id,
    name: answers.name?.trim() || "Anonymous",
    createdAt: row.created_at,
    date: new Date(row.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "Asia/Manila",
    }),
    visitFrequency: answers.visitFrequency || "Not given",
    ageGroup: answers.ageGroup || "Not given",
    rating,
    comment: answers.notes?.trim() || highlight || "No comment left.",
    preference: highlight || (answers.orderPreferences ?? []).join(", ") || "Not given",
    syncToVoice: Boolean(row.is_featured),
  };
}

export function toBuilderQuestions(questions) {
  return (Array.isArray(questions) ? questions : []).map((question, index) => ({
    id: question.id ?? index + 1,
    type: question.type ?? "text",
    text: question.text ?? "",
    options: question.options ?? [],
  }));
}