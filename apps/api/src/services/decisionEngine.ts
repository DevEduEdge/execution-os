export function decide(input: string) {
  const normalized = input.toLowerCase();

  if (normalized.match(/quit|resign|leave|job|manager|promotion|career/)) {
    return {
      decision: "Choose the move that protects your Assistant General Manager path.",
      actionStep: "Spend 25 minutes completing the one career task with the nearest visible result."
    };
  }

  if (normalized.match(/buy|spend|money|expense|loan|debt|save/)) {
    return {
      decision: "Do not spend on it today.",
      actionStep: "Record the amount, wait 24 hours, and use that money toward your highest-pressure bill."
    };
  }

  if (normalized.match(/health|gym|sleep|food|walk|workout|tired/)) {
    return {
      decision: "Do the smallest healthy version now.",
      actionStep: "Start a 10-minute walk or stretch before making any other decision."
    };
  }

  return {
    decision: "Pick the action that creates measurable progress before the day ends.",
    actionStep: "Set a 25-minute timer and finish the first physical step without reopening the decision."
  };
}
