import type { ScoreDefinition } from "../types";

export const nihss: ScoreDefinition = {
  items: [
    {
      id: "loc",
      title: "1a. Level of consciousness",
      help: "Responsiveness even with obtundation from intubation, language barrier, or trauma.",
      options: [
        { value: 0, label: "Alert; keenly responsive" },
        { value: 1, label: "Not alert, but arousable by minor stimulation" },
        {
          value: 2,
          label: "Not alert; requires repeated stimulation to attend",
          description: "Obtunded, requires strong/painful stimuli",
        },
        {
          value: 3,
          label: "Unresponsive or responds only with reflex movements",
        },
      ],
    },
    {
      id: "loc_questions",
      title: "1b. LOC questions",
      help: "Ask the patient the current month and their age.",
      options: [
        { value: 0, label: "Both questions answered correctly" },
        { value: 1, label: "One question answered correctly" },
        { value: 2, label: "Neither question answered correctly" },
      ],
    },
    {
      id: "loc_commands",
      title: "1c. LOC commands",
      help: "Ask the patient to open/close eyes, then grip and release the non-paretic hand.",
      options: [
        { value: 0, label: "Both tasks performed correctly" },
        { value: 1, label: "One task performed correctly" },
        { value: 2, label: "Neither task performed correctly" },
      ],
    },
    {
      id: "gaze",
      title: "2. Best gaze",
      help: "Test horizontal eye movements only.",
      options: [
        { value: 0, label: "Normal" },
        { value: 1, label: "Partial gaze palsy", description: "Abnormal gaze in one or both eyes, no forced deviation" },
        { value: 2, label: "Forced deviation or total gaze paresis not overcome by oculocephalic maneuver" },
      ],
    },
    {
      id: "visual",
      title: "3. Visual fields",
      options: [
        { value: 0, label: "No visual loss" },
        { value: 1, label: "Partial hemianopia" },
        { value: 2, label: "Complete hemianopia" },
        { value: 3, label: "Bilateral hemianopia (blind, including cortical blindness)" },
      ],
    },
    {
      id: "facial",
      title: "4. Facial palsy",
      options: [
        { value: 0, label: "Normal symmetric movements" },
        { value: 1, label: "Minor paralysis", description: "Flattened nasolabial fold, asymmetry on smiling" },
        { value: 2, label: "Partial paralysis", description: "Total or near-total lower face paralysis" },
        { value: 3, label: "Complete paralysis of one or both sides", description: "Absence of upper and lower face movement" },
      ],
    },
    {
      id: "arm_left",
      title: "5a. Motor arm — Left",
      help: "Arm extended 90° (sitting) or 45° (supine) for 10 seconds.",
      options: [
        { value: 0, label: "No drift for 10 seconds" },
        { value: 1, label: "Drift, but does not hit bed" },
        { value: 2, label: "Some effort against gravity, cannot maintain" },
        { value: 3, label: "No effort against gravity, limb falls" },
        { value: 4, label: "No movement" },
      ],
    },
    {
      id: "arm_right",
      title: "5b. Motor arm — Right",
      help: "Arm extended 90° (sitting) or 45° (supine) for 10 seconds.",
      options: [
        { value: 0, label: "No drift for 10 seconds" },
        { value: 1, label: "Drift, but does not hit bed" },
        { value: 2, label: "Some effort against gravity, cannot maintain" },
        { value: 3, label: "No effort against gravity, limb falls" },
        { value: 4, label: "No movement" },
      ],
    },
    {
      id: "leg_left",
      title: "6a. Motor leg — Left",
      help: "Leg held at 30° (always supine) for 5 seconds.",
      options: [
        { value: 0, label: "No drift for 5 seconds" },
        { value: 1, label: "Drift, but does not hit bed" },
        { value: 2, label: "Some effort against gravity" },
        { value: 3, label: "No effort against gravity, leg falls immediately" },
        { value: 4, label: "No movement" },
      ],
    },
    {
      id: "leg_right",
      title: "6b. Motor leg — Right",
      help: "Leg held at 30° (always supine) for 5 seconds.",
      options: [
        { value: 0, label: "No drift for 5 seconds" },
        { value: 1, label: "Drift, but does not hit bed" },
        { value: 2, label: "Some effort against gravity" },
        { value: 3, label: "No effort against gravity, leg falls immediately" },
        { value: 4, label: "No movement" },
      ],
    },
    {
      id: "ataxia",
      title: "7. Limb ataxia",
      help: "Finger-nose-finger and heel-shin tests. Score only if out of proportion to weakness.",
      options: [
        { value: 0, label: "Absent" },
        { value: 1, label: "Present in one limb" },
        { value: 2, label: "Present in two limbs" },
      ],
    },
    {
      id: "sensory",
      title: "8. Sensory",
      help: "Sensation to pinprick or noxious stimulus.",
      options: [
        { value: 0, label: "Normal; no sensory loss" },
        { value: 1, label: "Mild-to-moderate sensory loss" },
        { value: 2, label: "Severe to total sensory loss" },
      ],
    },
    {
      id: "language",
      title: "9. Best language",
      help: "Assess comprehension from naming, reading, and describing a picture.",
      options: [
        { value: 0, label: "No aphasia; normal" },
        { value: 1, label: "Mild-to-moderate aphasia" },
        { value: 2, label: "Severe aphasia" },
        { value: 3, label: "Mute, global aphasia; no usable speech or comprehension" },
      ],
    },
    {
      id: "dysarthria",
      title: "10. Dysarthria",
      options: [
        { value: 0, label: "Normal" },
        { value: 1, label: "Mild-to-moderate slurring; can be understood with difficulty" },
        { value: 2, label: "Severe; unintelligible or mute/anarthric" },
      ],
    },
    {
      id: "extinction",
      title: "11. Extinction and inattention (neglect)",
      options: [
        { value: 0, label: "No abnormality" },
        { value: 1, label: "Inattention/extinction to one sensory modality" },
        { value: 2, label: "Profound hemi-inattention or extinction to more than one modality" },
      ],
    },
  ],
  interpret(total) {
    if (total === 0)
      return {
        severity: "low",
        headline: "No stroke symptoms",
        detail: "A score of 0 indicates no measurable stroke deficit.",
      };
    if (total <= 4)
      return {
        severity: "low",
        headline: "Minor stroke",
        detail: "Scores of 1–4 correspond to a minor stroke.",
      };
    if (total <= 15)
      return {
        severity: "moderate",
        headline: "Moderate stroke",
        detail: "Scores of 5–15 correspond to a moderate stroke.",
      };
    if (total <= 20)
      return {
        severity: "high",
        headline: "Moderate to severe stroke",
        detail: "Scores of 16–20 correspond to a moderate-to-severe stroke.",
      };
    return {
      severity: "critical",
      headline: "Severe stroke",
      detail:
        "Scores of 21–42 correspond to a severe stroke and higher risk of poor outcome.",
    };
  },
};
