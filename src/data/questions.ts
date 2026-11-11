export type Question = {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
};

export const questions: Question[] = [
  {
    id: 1,
    question:
      'A 58-year-old female with type 2 diabetes has been on metformin 1000 mg BID and empagliflozin 10 mg daily for the past 6 months. Her most recent HbA1c is 8.2%, having not reached her target of <7.0% for approximately 3 months. What is the most appropriate next step in her pharmacologic management?',
    options: [
      'Add a DPP-4 inhibitor to create a triple oral combination therapy',
      'Discontinue all oral medications and start insulin monotherapy',
      'Increase the metformin dose to 1500 mg BID',
      'Switch empagliflozin to a sulfonylurea',
    ],
    correctIndex: 0,
    explanation:
      'The patient is uncontrolled on dual therapy (SGLT2i + metformin) and has not reached her A1c target for ~3 months. Adding a DPP-4 inhibitor as a third oral agent is an appropriate escalation to achieve triple combination oral anti-diabetic therapy before considering injectable options.',
    category: 'Pharmacology',
  },
  {
    id: 2,
    question:
      'A 62-year-old male with type 2 diabetes is on metformin 1000 mg BID and sitagliptin 100 mg daily. His HbA1c remains at 8.0% after 3 months, well above his target of <7.0%. Which class of oral anti-diabetic drugs would be most appropriate to add as a third agent?',
    options: [
      'SGLT2 inhibitor (e.g., empagliflozin or canagliflozin)',
      'Alpha-glucosidase inhibitor (e.g., acarbose)',
      'Bile acid sequestrant (e.g., colesevelam)',
      'Dopamine-2 agonist (e.g., bromocriptine)',
    ],
    correctIndex: 0,
    explanation:
      'An SGLT2 inhibitor is the most appropriate third agent for a patient uncontrolled on DPP-4i + metformin dual therapy. SGLT2 inhibitors offer robust A1c reduction, cardiovascular and renal benefits, and are well-suited for triple combination oral therapy.',
    category: 'Pharmacology',
  },
  {
    id: 3,
    question:
      'What is the general HbA1c target recommended for most non-pregnant adults with type 2 diabetes according to ADA guidelines?',
    options: ['< 6.0%', '< 7.0%', '< 8.0%', '< 9.0%'],
    correctIndex: 1,
    explanation:
      'The ADA recommends a general HbA1c target of <7.0% for most non-pregnant adults. Targets may be individualized based on age, comorbidities, and hypoglycemia risk.',
    category: 'Clinical Targets',
  },
  {
    id: 4,
    question:
      'World Diabetes Day is observed annually on which date?',
    options: ['November 1', 'November 14', 'December 1', 'October 28'],
    correctIndex: 1,
    explanation:
      'World Diabetes Day is observed every year on November 14, marking the birthday of Frederick Banting who co-discovered insulin in 1921.',
    category: 'Awareness',
  },
  {
    id: 5,
    question:
      'Which of the following is the primary mechanism of action of metformin?',
    options: [
      'Stimulates insulin secretion from pancreatic beta cells',
      'Reduces hepatic glucose production and improves insulin sensitivity',
      'Inhibits SGLT2 in the proximal tubule to reduce glucose reabsorption',
      'Slows carbohydrate absorption in the intestine',
    ],
    correctIndex: 1,
    explanation:
      'Metformin primarily reduces hepatic gluconeogenesis and improves peripheral insulin sensitivity. It does not stimulate insulin secretion, making it unlikely to cause hypoglycemia when used alone.',
    category: 'Pharmacology',
  },
  {
    id: 6,
    question:
      'SGLT2 inhibitors reduce blood glucose by which mechanism?',
    options: [
      'Increasing insulin secretion from pancreatic beta cells',
      'Inhibiting glucose reabsorption in the proximal renal tubule',
      'Reducing intestinal glucose absorption',
      'Enhancing peripheral tissue insulin sensitivity',
    ],
    correctIndex: 1,
    explanation:
      'SGLT2 inhibitors block the sodium-glucose cotransporter 2 in the proximal renal tubule, preventing glucose reabsorption and promoting glucosuria, which lowers blood glucose levels independently of insulin.',
    category: 'Pharmacology',
  },
  {
    id: 7,
    question:
      'DPP-4 inhibitors lower blood glucose primarily by:',
    options: [
      'Increasing the half-life of incretin hormones GLP-1 and GIP',
      'Directly stimulating insulin release independent of glucose',
      'Reducing renal glucose reabsorption',
      'Blocking hepatic gluconeogenesis',
    ],
    correctIndex: 0,
    explanation:
      'DPP-4 inhibitors block the enzyme dipeptidyl peptidase-4, which degrades incretin hormones GLP-1 and GIP. This prolongs their action, leading to glucose-dependent insulin secretion and reduced glucagon.',
    category: 'Pharmacology',
  },
  {
    id: 8,
    question:
      'The triple combination of metformin + SGLT2i + DPP-4i is most appropriate for which patient profile?',
    options: [
      'A patient uncontrolled on dual oral therapy who has not reached A1c target for ~3 months and prefers to avoid injectable therapy',
      'A newly diagnosed patient with an HbA1c of 6.5%',
      'A patient with severe insulin deficiency requiring immediate insulin initiation',
      'A patient with type 1 diabetes',
    ],
    correctIndex: 0,
    explanation:
      'Triple oral combination therapy is most appropriate for patients who remain uncontrolled on dual oral therapy, have not met their A1c target for ~3 months, and wish to delay or avoid injectable therapy. It is not appropriate for newly diagnosed patients or those with severe insulin deficiency.',
    category: 'Clinical Decision Making',
  },
  {
    id: 9,
    question:
      'Which of the following is a well-established cardiovascular benefit of SGLT2 inhibitors?',
    options: [
      'Reduction in major adverse cardiovascular events (MACE) and heart failure hospitalization',
      'Increase in HDL cholesterol by >50%',
      'Complete reversal of coronary artery disease',
      'Reduction in blood pressure by >20 mmHg',
    ],
    correctIndex: 0,
    explanation:
      'SGLT2 inhibitors have demonstrated significant reductions in MACE and heart failure hospitalization in cardiovascular outcome trials, making them preferred agents in patients with established ASCVD or heart failure.',
    category: 'Pharmacology',
  },
  {
    id: 10,
    question:
      'What is the blue circle symbol associated with World Diabetes Day meant to represent?',
    options: [
      'The global diabetes community united against diabetes',
      'Insulin vials',
      'Blood glucose testing',
      'Pancreatic beta cells',
    ],
    correctIndex: 0,
    explanation:
      'The blue circle is the global symbol for diabetes awareness, representing the unity of the international diabetes community in response to the diabetes pandemic.',
    category: 'Awareness',
  },
];

export function getRandomQuestion(): Question {
  const index = Math.floor(Math.random() * questions.length);
  return questions[index];
}
