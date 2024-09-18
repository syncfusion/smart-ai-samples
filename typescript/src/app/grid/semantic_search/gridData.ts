export interface MedicalRecord {
    RecordID: number;
    PatientID: number;
    Symptoms: string;
    Diagnosis: string;
    DoctorDetails: string;
};

export let MedicalRecords: MedicalRecord[] = [
    { RecordID: 1, PatientID: 615001, Symptoms: "Fever, cough, and shortness of breath.", Diagnosis: "Pneumonia", DoctorDetails: "Dr. John Smith - Specialized in Pulmonology" },
    { RecordID: 2, PatientID: 615002, Symptoms: "Severe headache, nausea, and sensitivity to light.", Diagnosis: "Migraine", DoctorDetails: "Dr. Alice Brown - Specialized in Neurology" },
    { RecordID: 3, PatientID: 615003, Symptoms: "Fatigue, weight gain, and hair loss.", Diagnosis: "Hypothyroidism", DoctorDetails: "Dr. Robert Johnson - Specialized in Endocrinology" },
    { RecordID: 4, PatientID: 615004, Symptoms: "Chest pain, shortness of breath, and sweating.", Diagnosis: "Heart Attack", DoctorDetails: "Dr. Michael Williams - Specialized in Cardiology" },
    { RecordID: 5, PatientID: 615005, Symptoms: "Joint pain, stiffness, and swelling.", Diagnosis: "Arthritis", DoctorDetails: "Dr. Mary Jones - Specialized in Rheumatology" },
    { RecordID: 6, PatientID: 615006, Symptoms: "Abdominal pain, bloating, and irregular bowel movements.", Diagnosis: "Irritable Bowel Syndrome (IBS)", DoctorDetails: "Dr. Patricia Garcia - Specialized in Gastroenterology" },
    { RecordID: 7, PatientID: 615007, Symptoms: "Frequent urination, excessive thirst, and unexplained weight loss.", Diagnosis: "Diabetes", DoctorDetails: "Dr. Robert Johnson - Specialized in Endocrinology" },
    { RecordID: 8, PatientID: 615008, Symptoms: "Persistent sadness, loss of interest, and fatigue.", Diagnosis: "Depression", DoctorDetails: "Dr. Linda Martinez - Specialized in Psychiatry" },
    { RecordID: 9, PatientID: 615009, Symptoms: "Shortness of breath, wheezing, and chronic cough.", Diagnosis: "Asthma", DoctorDetails: "Dr. John Smith - Specialized in Pulmonology" },
    { RecordID: 10, PatientID: 615010, Symptoms: "High blood pressure, headaches, and blurred vision.", Diagnosis: "Hypertension", DoctorDetails: "Dr. Michael Williams - Specialized in Cardiology" }
];