// --- CONSTANTS FOR DATA FILE URLs ---
// Using Phase 1 Aggregated Scores as per your correction, and Phase 2 Question Details
const AGGREGATED_SCORES_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSySYBO9YL3N4aUG3JEYZMQQIv9d1oSm3ba4Ty9Gt4SsGs2zmTS_k81rH3Qv41mZvClnayNcDpl_QbI/pub?gid=1890969747&single=true&output=csv';
const QUESTION_DETAILS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRJl8XYak_fAzpuboA6GgOO-hEMd6rP_X9BD7ruZ-pSnIGGkd27uGmP2ZWeBcwSvSKsafObcXDOW080/pub?gid=822014112&single=true&output=csv';
const STUDENT_MAPPING_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRJl8XYak_fAzpuboA6GgOO-hEMd6rP_X9BD7ruZ-pSnIGKkd27uGmP2ZWeBcwSvSKsafObcXDOW080/pub?gid=0&single=true&output=csv';

// --- CONFIGURATION ---
// IMPORTANT: Change this to the student ID you want to view
const STUDENT_ID_TO_FILTER = "7300000000000001"; // Example student ID from your data, adjust as needed

// --- GLOBAL DATA STORAGE ---
let currentStudentData = {}; // This will be populated from CSVs
let ALL_DASHBOARD_QUESTIONS = []; // Flat list of all questions for easy lookup


// --- MAPPING SAT SKILLS TO BOOK CHAPTERS (extracted from your PDF) ---
const SAT_CHAPTER_SKILL_MAPPING = {
    math: {
        "Understanding and applying properties of exponents": ["1: Exponents & Radicals"],
        "working with radical expressions": ["1: Exponents & Radicals"],
        "understanding rational exponents": ["1: Exponents & Radicals"],
        "Calculating and applying percentages": ["2: Percent"],
        "percent increase/decrease": ["2: Percent"],
        "solving word problems involving percents": ["2: Percent"],
        "Identifying, interpreting, and comparing linear and exponential growth models": ["3: Exponential & Linear Growth"],
        "creating and solving equations from these models": ["3: Exponential & Linear Growth"],
        "Calculating and applying rates, including unit rates, speed, and work rates": ["4: Rates"],
        "unit conversions": ["4: Rates"],
        "Setting up and solving problems involving ratios and proportions": ["5: Ratio & Proportion"],
        "Manipulating and simplifying algebraic expressions, including polynomials": ["6: Expressions"],
        "factoring": ["6: Expressions"],
        "Translating word problems into algebraic equations or inequalities": ["7: Constructing Models"],
        "creating linear and nonlinear models": ["7: Constructing Models"],
        "Solving linear equations in one or more variables": ["8: Manipulating & Solving Equations"],
        "solving various forms of nonlinear equations": ["8: Manipulating & Solving Equations"],
        "Applying advanced strategies to solve complex equations, including those involving quadratics, absolute values, and systems": ["9: More Equation Solving Strategies"],
        "Solving systems of two linear equations in two variables using various methods (substitution, elimination)": ["10: Systems of Equations"],
        "Solving linear inequalities in one or two variables": ["11: Inequalities"],
        "graphing solutions": ["11: Inequalities"],
        "Applying algebraic and arithmetic skills to solve a variety of contextualized problems": ["12: Word Problems"],
        "Solving optimization problems, often by finding the vertex of a quadratic function or analyzing inequalities": ["13: Min & Max Word Problems"],
        "Understanding and applying properties of lines, including slope, intercepts, and equations of lines": ["14: Lines"],
        "Interpreting the slope and intercepts of linear models in context": ["15: Interpreting Linear Models"],
        "making predictions (linear models)": ["15: Interpreting Linear Models"],
        "Understanding function notation, domain, range": ["16: Functions"],
        "evaluating functions": ["16: Functions"],
        "transformations (functions)": ["16: Functions"],
        "composition of functions": ["16: Functions"],
        "Solving quadratic equations (factoring, quadratic formula, completing the square)": ["17: Quadratics"],
        "graphing parabolas": ["17: Quadratics"],
        "understanding properties of quadratic functions": ["17: Quadratics"],
        "Performing polynomial division (specifically synthetic division)": ["18: Synthetic Division"],
        "finding roots of polynomials": ["18: Synthetic Division"],
        "Performing operations with complex numbers": ["19: Complex Numbers"],
        "Solving equations and inequalities involving absolute value": ["20: Absolute Value"],
        "Understanding and applying angle relationships": ["21: Angles"],
        "Applying properties of triangles, including Pythagorean theorem, similar triangles, special right triangles, and basic trigonometric ratios": ["22: Triangles"],
        "Understanding and applying properties of circles, including equations, radius, diameter, circumference, area, arc length, and sector area": ["23: Circles"],
        "Applying trigonometric ratios (sine, cosine, tangent) in right triangles": ["24: Trigonometry"],
        "understanding radians and the unit circle (basics)": ["24: Trigonometry"],
        "Interpreting and analyzing data presented in tables, charts, and graphs (scatterplots, bar graphs, line graphs)": ["25: Reading Data"],
        "Calculating basic probabilities, including compound events": ["26: Probability"],
        "Calculating and interpreting measures of central tendency (mean, median, mode) and spread (range)": ["27: Statistics 1"],
        "Understanding standard deviation, distributions (like normal distribution basics), and basic statistical inference": ["28: Statistics 2"],
        "Calculating the volume of 3D shapes (e.g., prisms, cylinders, cones, spheres)": ["29: Volume"]
    },
    writing: {
        "Choosing the most logical and effective transition words or phrases to connect ideas, sentences, and paragraphs": ["1: Transitions"],
        "Ensuring writing is concise, precise, and directly relevant to the rhetorical situation or main idea": ["2: Specific Focus"],
        "eliminating redundancy": ["2: Specific Focus"],
        "Identifying and correcting sentence fragments and run-on sentences": ["3: Sentences & Fragments"],
        "ensuring complete sentence structures": ["3: Sentences & Fragments"],
        "Correctly using punctuation (commas, semicolons, colons) and conjunctions to join or separate independent and dependent clauses": ["4: Joining & Separating Sentences"],
        "Advanced application of rules for combining clauses and phrases, avoiding fragments and run-ons": ["5: Joining Sentences & Fragments"],
        "Correctly punctuating restrictive (essential) and non-restrictive (non-essential) clauses, primarily with commas": ["6: Non-Essential & Essential Clauses"],
        "Applying comma rules for items in a series, introductory elements, appositives, interrupters, and avoiding common misuses like comma splices": ["7: Additional Comma Uses & Misuses"],
        "Ensuring subject-verb agreement and consistent, appropriate verb tense": ["8: Verbs Agreements and Tense"],
        "Ensuring pronoun-antecedent agreement, correct pronoun case (subjective, objective, possessive), and clear pronoun reference": ["9: Pronouns"],
        "Correctly using apostrophes for possessive nouns, possessive pronouns (or lack thereof), and contractions": ["10: Apostrophes"],
        "Ensuring modifiers (adjectives, adverbs, phrases, clauses) are correctly placed to modify the intended word and avoiding dangling or misplaced modifiers": ["11: Modification"],
        "Maintaining parallel grammatical structure for items in a list, series, or comparison": ["12: Parallel Structure"],
        "Choosing the correct word from commonly confused pairs (e.g., affect/effect)": ["13: Word Pairs"],
        "understanding idiomatic expressions": ["13: Word Pairs"],
        "Correctly using question marks at the end of direct questions": ["14: Question Marks"],
        "Understanding the function of different parts of speech as a foundation for other grammar rules": ["Appendix: Parts of Speech"]
    },
    reading: {
        "Understanding the overall structure and approach to the Reading and Writing section": ["1: Overview of SAT Reading"],
        "Determining the meaning of words and phrases as they are used in particular contexts within the passage": ["2: Vocabulary in Context"],
        "Drawing logical inferences and conclusions based on information stated or implied in the text": ["3: Making the Leap"],
        "Identifying the main idea or central theme of a passage or a significant portion of it": ["4: The Big Picture"],
        "Locating and understanding explicitly stated information and details within the text": ["5: Literal Comprehension"],
        "Analyzing how specific words, phrases, sentences, or paragraphs contribute to the author's overall purpose, argument, or the structure of the text": ["6: Reading for Function"],
        "Choosing words/phrases that best complete the meaning/logic of a portion of text": ["7: Text Completions"],
        "Identifying textual evidence that best supports a given claim or identifying claims/evidence that would undermine an argument": ["8: Supporting & Undermining"],
        "Interpreting data presented in tables, graphs, and charts, and integrating that information with textual information": ["9: Graphs & Charts"],
        "Analyzing the relationship between two related texts, including identifying points of agreement/disagreement, or how one text responds to/elabo rates on the other": ["10: Paired Passages"],
        "Reviewing various question formats and strategies for approaching them": ["Appendix: Question Types"]
    }
};

// --- DUMMY CHAPTERS (Populated from currentStudentData.chapters in previous version) ---
// These will be used for displaying chapter lists if specific ones are not derived from questions
const STATIC_CHAPTER_LISTS = {
    math: [
        "1: Exponents & Radicals", "2: Percent", "3: Exponential & Linear Growth",
        "4: Rates", "5: Ratio & Proportion", "6: Expressions", "7: Constructing Models",
        "8: Manipulating & Solving Equations", "9: More Equation Solving Strategies",
        "10: Systems of Equations", "11: Inequalities", "12: Word Problems",
        "13: Min & Max Word Problems", "14: Lines", "15: Interpreting Linear Models",
        "16: Functions", "17: Quadratics", "18: Synthetic Division", "19: Complex Numbers",
        "20: Absolute Value", "21: Angles", "22: Triangles", "23: Circles", "24: Trigonometry",
        "25: Reading Data", "26: Probability", "27: Statistics 1", "28: Statistics 2", "29: Volume"
    ],
    writing: [
        "1: Transitions", "2: Specific Focus", "3: Sentences & Fragments",
        "4: Joining & Separating Sentences", "5: Joining Sentences & Fragments",
        "6: Non-Essential & Essential Clauses", "7: Additional Comma Uses & Misuses",
        "8: Verbs Agreements and Tense", "9: Pronouns", "10: Apostrophes",
        "11: Modification", "12: Parallel Structure", "13: Word Pairs", "14: Question Marks",
        "Appendix: Parts of Speech"
    ],
    reading: [
        "1: Overview of SAT Reading", "2: Vocabulary in Context", "3: Making the Leap",
        "4: The Big Picture", "5: Literal Comprehension", "6: Reading for Function",
        "7: Text Completions", "8: Supporting & Undermining", "9: Graphs & Charts",
        "10: Paired Passages", "Appendix: Question Types"
    ]
};


// --- Date Formatting Helper ---
function formatDate(dateString) {
    if (!dateString || dateString === "N/A" || dateString === "Not Attempted") return dateString;
    try {
        const date = new Date(dateString + 'T00:00:00'); // Assume UTC to avoid timezone issues
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month}, ${year}`;
    } catch (e) {
        console.warn("Error formatting date:", dateString, e);
        return dateString;
    }
}

// --- PapaParse Utility Function ---
/**
 * Fetches and parses a CSV file using PapaParse.
 * @param {string} url - The URL of the CSV file.
 * @returns {Promise<Array<Object>>} A promise that resolves with an array of parsed CSV rows (objects).
 */
function fetchCsv(url) {
    return new Promise((resolve, reject) => {
        PapaParse.parse(url, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                if (results.errors.length) {
                    console.error('PapaParse errors for', url, ':', results.errors);
                    reject(results.errors);
                } else {
                    resolve(results.data);
                }
            },
            error: function(err) {
                console.error('Network or parsing error for', url, ':', err);
                reject(err);
            }
        });
    });
}


// --- MAIN DATA LOADING AND TRANSFORMATION ---
async function loadAndProcessData() {
    console.log("Starting data loading and processing...");

    try {
        // Fetch raw data from CSVs
        const [aggregatedScoresRaw, questionDetailsRaw, studentMappingRaw] = await Promise.all([
            fetchCsv(AGGREGATED_SCORES_CSV_URL),
            fetchCsv(QUESTION_DETAILS_CSV_URL),
            fetchCsv(STUDENT_MAPPING_CSV_URL)
        ]);
        console.log("Raw aggregated scores:", aggregatedScoresRaw.length, "rows.");
        console.log("Raw question details:", questionDetailsRaw.length, "rows.");
        console.log("Raw student mapping:", studentMappingRaw.length, "rows.");

        // --- Step 1: Filter data for the specific student ---
        const studentInfo = studentMappingRaw.find(s => s['Student ID'] === STUDENT_ID_TO_FILTER);
        if (!studentInfo) {
            console.error(`Student with ID ${STUDENT_ID_TO_FILTER} not found in student mapping.`);
            document.getElementById('overview-kpis').innerHTML = '<p class="text-red-600 text-center col-span-5">Error: Student data not found. Please check the STUDENT_ID_TO_FILTER.</p>';
            return; // Stop execution if student not found
        }

        const studentAggregatedScores = aggregatedScoresRaw.filter(row => row['Student ID'] === STUDENT_ID_TO_FILTER);
        const studentQuestionDetails = questionDetailsRaw.filter(row => row['Student ID'] === STUDENT_ID_TO_FILTER);
        console.log(`Filtered data for student ${STUDENT_ID_TO_FILTER}:`);
        console.log("Aggregated scores rows:", studentAggregatedScores.length);
        console.log("Question details rows:", studentQuestionDetails.length);


        // --- Step 2: Initialize currentStudentData structure ---
        currentStudentData = {
            name: studentInfo['Student Name'] || `Student ${STUDENT_ID_TO_FILTER}`,
            targetScore: parseInt(studentInfo['Target SAT Score']) || 1400, // Assuming a 'Target SAT Score' column in Student_Mapping
            latestScores: { total: 0, rw: 0, math: 0, avgEocKhan: 0 },
            timeSpent: { studentAvg: 0, studentUnit: "min / day", classAvg: 0, classUnit: "min / day"},
            scoreTrend: { labels: [], studentScores: [], classAvgScores: [] },
            overallSkillPerformance: { labels: ['Reading', 'Writing', 'Math'], studentAccuracy: [0, 0, 0], classAvgAccuracy: [0, 0, 0] },
            cbPracticeTests: [],
            eocQuizzes: { reading: [], writing: [], math: [] },
            khanAcademy: { reading: [], writing: [], math: [] },
            skills: { reading: [], writing: [], math: [] },
            chapters: STATIC_CHAPTER_LISTS
        };


        // --- Step 3: Populate currentStudentData.latestScores, scoreTrend, timeSpent from Aggregated Scores ---
        const latestTest = studentAggregatedScores
            .filter(row => row['Assessment Type'] === 'CB Practice Test' && row['Total Score'] && row['Date Attempted']) // Filter for actual tests with scores and dates
            .sort((a, b) => new Date(b['Date Attempted']) - new Date(a['Date Attempted']))[0];

        if (latestTest) {
            currentStudentData.latestScores.total = parseInt(latestTest['Total Score']) || 0;
            currentStudentData.latestScores.rw = parseInt(latestTest['R&W Score']) || 0;
            currentStudentData.latestScores.math = parseInt(latestTest['Math Score']) || 0;
            // Assuming Avg EOC/Khan comes from a specific 'Overall Average' row or needs calculation
            // For now, setting a placeholder or calculate based on available EOC/Khan data later
            const avgEocKhanRow = studentAggregatedScores.find(row => row['Assessment Type'] === 'Overall Average');
            if (avgEocKhanRow && avgEocKhanRow['Avg EOC/Khan Score']) { // Adjust column name if different
                 currentStudentData.latestScores.avgEocKhan = parseFloat(avgEocKhanRow['Avg EOC/Khan Score']) || 0;
            } else {
                currentStudentData.latestScores.avgEocKhan = 0; // Default if not found
            }
        }

        // Populate Score Trend
        const scoreTrendData = studentAggregatedScores
            .filter(row => row['Assessment Type'] === 'CB Practice Test' && row['Total Score'] && row['Date Attempted'])
            .sort((a, b) => new Date(a['Date Attempted']) - new Date(b['Date Attempted']));

        currentStudentData.scoreTrend.labels = scoreTrendData.map(row => row['Test Name']);
        currentStudentData.scoreTrend.studentScores = scoreTrendData.map(row => parseInt(row['Total Score']) || 0);
        currentStudentData.scoreTrend.classAvgScores = scoreTrendData.map(row => parseInt(row['Class Avg Total']) || 0);

        // Populate Time Spent (Assuming specific row in Aggregated Scores or separate sheet)
        const timeSpentRow = studentAggregatedScores.find(row => row['Assessment Type'] === 'Time Spent'); // Adjust based on your data if different
        if (timeSpentRow) {
            currentStudentData.timeSpent.studentAvg = parseFloat(timeSpentRow['Your Avg Time (min/day)']) || 0; // Adjust column names
            currentStudentData.timeSpent.classAvg = parseFloat(timeSpentRow['Class Avg Time (min/day)']) || 0; // Adjust column names
        } else {
            currentStudentData.timeSpent = { studentAvg: 0, studentUnit: "min / day", classAvg: 0, classUnit: "min / day"}; // Default to 0 if not found
        }

        // --- Step 4: Process Question Details for cbPracticeTests, eocQuizzes, and skills ---
        const cbTestsMap = new Map();
        const eocQuizzesMap = { reading: new Map(), writing: new Map(), math: new Map() };
        const skillsPerformance = { reading: {}, writing: {}, math: {} }; // For calculating dynamic skills

        studentQuestionDetails.forEach(qRow => {
            // Validate essential fields before processing
            if (!qRow['Question ID'] || !qRow['Subject'] || !qRow['SAT Skill']) {
                console.warn("Skipping question row due to missing essential data:", qRow);
                return;
            }

            const questionId = qRow['Question ID'];
            const subject = (qRow['Subject'] || '').toLowerCase();
            const skill = qRow['SAT Skill'];
            const difficulty = qRow['Difficulty'] || 'Unknown';
            const yourAnswer = qRow['Student Answer'] || '';
            const correctAnswer = qRow['Correct Answer'] || '';
            const isCorrect = (yourAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase() && yourAnswer !== '' && correctAnswer !== ''); // Derived logic
            const explanation = qRow['Explanation'] || 'No explanation available.';
            const yourTime = parseFloat(qRow['Your Time (s)']) || 0;
            const classAvgTime = parseFloat(qRow['Class Avg Time (s)']) || 0;
            const source = qRow['Test Name'] || qRow['Quiz Name'] || 'Unknown Source'; // Use Test Name for CB, Quiz Name for EOC
            const questionText = qRow['Question Text'] || `Question ${questionId}`;

            // Class Performance calculation
            const classCorrect = parseFloat(qRow['Class % Correct']) || 0;
            const classIncorrect = parseFloat(qRow['Class % Incorrect']) || 0;
            const classUnanswered = parseFloat(qRow['Class % Unanswered']) || (100 - classCorrect - classIncorrect);

            const questionObj = {
                id: questionId,
                subject: subject,
                skill: skill,
                difficulty: difficulty,
                yourAnswer: yourAnswer,
                correctAnswer: correctAnswer,
                isCorrect: isCorrect,
                explanation: explanation,
                yourTime: yourTime,
                classAvgTime: classAvgTime,
                classPerformance: {
                    correct: classCorrect,
                    incorrect: classIncorrect,
                    unanswered: classUnanswered
                },
                source: source,
                text: questionText
            };
            ALL_DASHBOARD_QUESTIONS.push(questionObj);

            // Group questions by their source (Test or EOC Quiz)
            if (qRow['Assessment Type'] === 'CB Practice Test' && source) {
                if (!cbTestsMap.has(source)) {
                    const testAggregate = studentAggregatedScores.find(r => r['Test Name'] === source && r['Assessment Type'] === 'CB Practice Test');
                    cbTestsMap.set(source, {
                        name: source,
                        date: testAggregate ? (testAggregate['Date Attempted'] || "Not Attempted") : "Not Attempted",
                        rw: testAggregate ? (testAggregate['R&W Score'] || "-") : "-",
                        math: testAggregate ? (testAggregate['Math Score'] || "-") : "-",
                        total: testAggregate ? (testAggregate['Total Score'] || "-") : "-",
                        questions: []
                    });
                }
                cbTestsMap.get(source).questions.push(questionObj);
            } else if (qRow['Assessment Type'] === 'EOC Quiz' && subject && eocQuizzesMap[subject] && source) {
                if (!eocQuizzesMap[subject].has(source)) {
                    eocQuizzesMap[subject].set(source, {
                        name: source,
                        date: qRow['Date Attempted'] || "N/A",
                        latestScore: `${classCorrect}%`, // Simplistic score for quiz based on class performance
                        questions: []
                    });
                }
                eocQuizzesMap[subject].get(source).questions.push(questionObj);
            }

            // Aggregate data for dynamic skills performance
            if (skill && subject && ['reading', 'writing', 'math'].includes(subject)) {
                if (!skillsPerformance[subject][skill]) {
                    skillsPerformance[subject][skill] = {
                        correctCount: 0,
                        totalCount: 0,
                        classCorrectSum: 0, // Sum of class correct percentages for average
                        classTotalCount: 0 // Count of questions to average class performance
                    };
                }
                skillsPerformance[subject][skill].totalCount++;
                if (isCorrect) {
                    skillsPerformance[subject][skill].correctCount++;
                }
                skillsPerformance[subject][skill].classCorrectSum += classCorrect;
                skillsPerformance[subject][skill].classTotalCount++;
            }
        });

        // Convert Maps to Arrays for currentStudentData
        currentStudentData.cbPracticeTests = Array.from(cbTestsMap.values());
        // Ensure all 8 CB practice tests are listed, even if no detailed questions found for them
        const allCBTestNames = [
            "Diagnostic Test", "Official Practice Test 1", "Official Practice Test 4",
            "Official Practice Test 5", "Official Practice Test 6", "Official Practice Test 7",
            "Official Practice Test 8", "Official Practice Test 9", "Official Practice Test 10"
        ];
        allCBTestNames.forEach(testName => {
            if (!currentStudentData.cbPracticeTests.some(test => test.name === testName)) {
                const testAggregate = studentAggregatedScores.find(r => r['Test Name'] === testName && r['Assessment Type'] === 'CB Practice Test');
                currentStudentData.cbPracticeTests.push({
                    name: testName,
                    date: testAggregate ? (testAggregate['Date Attempted'] || "Not Attempted") : "Not Attempted",
                    rw: testAggregate ? (testAggregate['R&W Score'] || "-") : "-",
                    math: testAggregate ? (testAggregate['Math Score'] || "-") : "-",
                    total: testAggregate ? (testAggregate['Total Score'] || "-") : "-",
                    questions: [] // No questions found for this test
                });
            }
        });
        // Re-sort CB tests consistently
        currentStudentData.cbPracticeTests.sort((a, b) => {
            const dateA = new Date(a.date !== "Not Attempted" ? a.date : "1970-01-01");
            const dateB = new Date(b.date !== "Not Attempted" ? b.date : "1970-01-01");
            return dateA - dateB;
        });


        ['reading', 'writing', 'math'].forEach(sub => {
            currentStudentData.eocQuizzes[sub] = Array.from(eocQuizzesMap[sub].values());
            currentStudentData.eocQuizzes[sub].sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort EOC quizzes

            // Convert aggregated skills data into the required format
            for (const skillName in skillsPerformance[sub]) {
                const skillData = skillsPerformance[sub][skillName];
                const studentScore = skillData.totalCount > 0 ? Math.round((skillData.correctCount / skillData.totalCount) * 100) : 0;
                const classAvg = skillData.classTotalCount > 0 ? Math.round((skillData.classCorrectSum / skillData.classTotalCount)) : 0;

                currentStudentData.skills[sub].push({
                    name: skillName,
                    score: studentScore,
                    classAvg: classAvg,
                    attempted: skillData.totalCount > 0
                });
            }
        });

        // Populate overallSkillPerformance for charts
        ['reading', 'writing', 'math'].forEach((sub, index) => {
            const subjectSkills = currentStudentData.skills[sub];
            if (subjectSkills.length > 0) {
                const totalStudentScore = subjectSkills.reduce((sum, s) => sum + s.score, 0);
                const totalClassAvg = subjectSkills.reduce((sum, s) => sum + s.classAvg, 0);
                currentStudentData.overallSkillPerformance.studentAccuracy[index] = Math.round(totalStudentScore / subjectSkills.length);
                currentStudentData.overallSkillPerformance.classAvgAccuracy[index] = Math.round(totalClassAvg / subjectSkills.length);
            } else {
                 currentStudentData.overallSkillPerformance.studentAccuracy[index] = 0;
                 currentStudentData.overallSkillPerformance.classAvgAccuracy[index] = 0;
            }
        });


        console.log("Final processed currentStudentData:", currentStudentData);

        // --- Step 5: Render UI with processed data ---
        populateDashboardUI();

    } catch (error) {
        console.error("Failed to load or process data:", error);
        document.getElementById('overview-kpis').innerHTML = '<p class="text-red-600 text-center col-span-5">Error loading dashboard data. Please try again later or check console for details.</p>';
        document.getElementById('cb-practice-tests-table-body').innerHTML = '<tr><td colspan="5" class="text-red-600 text-center">Failed to load test data.</td></tr>';
        // You might want to add a general loading message to the whole page, then clear it on success/fail.
    }
}


// Function to call all UI population functions
function populateDashboardUI() {
    // Student name display is now in HTML header, it can be updated here from currentStudentData
    document.getElementById('studentNameDisplay').textContent = `Welcome! ${currentStudentData.name}`;

    populateOverview(currentStudentData);
    populatePracticeTestsTable(currentStudentData.cbPracticeTests);

    ['reading', 'writing', 'math'].forEach(subject => {
        populateEOCPractice(subject, currentStudentData.eocQuizzes[subject] || []);
        populateKhanAcademy(subject, currentStudentData.khanAcademy[subject] || []); // Still dummy for Khan
        // Skills Hub is populated when its sub-tab is clicked
    });

    // Ensure the initial tab is correctly activated
    // This will trigger initial chart rendering for overview and default sub-tab for reading
    document.querySelector('.main-tab-button[data-main-tab="overview"]')?.click();
}


// --- Main Execution Block (moved to window.onload) ---
window.onload = function() {
    // --- Chart.js Global Configuration ---
    Chart.defaults.font.family = 'Inter';
    Chart.defaults.plugins.legend.position = 'bottom';
    Chart.defaults.responsive = true;
    Chart.defaults.maintainAspectRatio = false;

    loadAndProcessData(); // Start data loading
    setupEventListeners(); // Setup UI event listeners
};


/**
 * Sets up all the interactive elements like tabs, mobile menu, and the refresh button.
 */
function setupEventListeners() {
    const mainTabs = document.querySelectorAll('.main-tab-button');
    const mainTabContents = document.querySelectorAll('.main-tab-content');
    const hamburgerButton = document.getElementById('hamburgerButton');
    const mobileMenu = document.getElementById('mobileMenu');
    const refreshDataBtn = document.getElementById('refreshDataBtn');

    document.getElementById('currentYear').textContent = new Date().getFullYear();

    hamburgerButton?.addEventListener('click', () => mobileMenu?.classList.toggle('hidden'));
    refreshDataBtn?.addEventListener('click', handleRefreshData);

    /**
     * Handles switching between main tabs.
     * @param {HTMLElement} tabElement - The button element that was clicked.
     */
    const switchMainTab = (tabElement) => {
        const targetTabName = tabElement.getAttribute('data-main-tab');

        // Deactivate all main tabs and hide all content
        mainTabs.forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.mobile-nav-link').forEach(link => link.classList.remove('active'));
        mainTabContents.forEach(content => content.classList.add('hidden'));

        // Activate the clicked tab and show its content
        document.querySelector(`.main-tab-button[data-main-tab="${targetTabName}"]`)?.classList.add('active');
        document.querySelector(`.mobile-nav-link[data-main-tab="${targetTabName}"]`)?.classList.add('active');
        document.getElementById(targetTabName + '-content')?.classList.remove('hidden');

        // Special handling for overview tab charts and subject tab sub-tabs
        if (targetTabName === 'overview') {
            initializeOverviewCharts(currentStudentData);
        } else if (['reading', 'writing', 'math'].includes(targetTabName)) {
            // For subject tabs, activate the default sub-tab (Skills Hub)
            const firstSubTabButton = document.querySelector(`#${targetTabName}-content .sub-tab-button[data-sub-tab="${targetTabName}-skills-hub"]`);
            if (firstSubTabButton) {
                switchSubTab(firstSubTabButton); // Programmatically click it
            }
        }

        // Hide mobile menu after selection
        mobileMenu?.classList.add('hidden');
    };

    // Attach event listeners to main tab buttons
    mainTabs.forEach(tab => tab.addEventListener('click', () => switchMainTab(tab)));
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            switchMainTab(link);
        });
    });

    /**
     * Handles switching between sub-tabs within a main tab.
     * @param {HTMLElement} subTabElement - The button element that was clicked.
     */
    const switchSubTab = (subTabElement) => {
        const parentMainContent = subTabElement.closest('.main-tab-content');
        const targetSubTabName = subTabElement.getAttribute('data-sub-tab');

        // Deactivate all sub-tabs and hide all sub-tab content panels in the current main tab
        parentMainContent.querySelectorAll('.sub-tab-button').forEach(st => st.classList.remove('active'));
        parentMainContent.querySelectorAll('.sub-tab-content-panel').forEach(panel => panel.classList.add('hidden'));

        // Activate the clicked sub-tab and show its content panel
        subTabElement.classList.add('active');
        document.getElementById(targetSubTabName + '-content')?.classList.remove('hidden');

        // Special rendering logic for Skills Hub when activated
        if (targetSubTabName.endsWith('-skills-hub')) {
            const subject = targetSubTabName.replace('-skills-hub', '');
            populateSkillsHub(subject, currentStudentData.skills[subject] || []);
        }
    };

    // Attach event listeners to sub-tab buttons
    document.querySelectorAll('.sub-tab-button').forEach(subTab => {
        subTab.addEventListener('click', () => switchSubTab(subTab));
    });

    // The initial click on overview is now handled by populateDashboardUI after data is loaded
    // document.querySelector('.main-tab-button[data-main-tab="overview"]')?.click();
}

/**
 * Placeholder for future data refresh logic (e.g., Google App Script call).
 * Now triggers a full data reload from CSVs.
 */
async function handleRefreshData() {
    console.log("Refresh Data button clicked! Reloading data from CSVs.");
    const originalRefreshText = document.getElementById('refreshDataBtn').textContent;
    document.getElementById('refreshDataBtn').textContent = 'Refreshing...';
    document.getElementById('refreshDataBtn').disabled = true;

    try {
        await loadAndProcessData(); // Re-fetch and re-process all data
        alert("Dashboard data refreshed successfully!");
    } catch (error) {
        alert("Failed to refresh dashboard data. Check console for errors.");
    } finally {
        document.getElementById('refreshDataBtn').textContent = originalRefreshText;
        document.getElementById('refreshDataBtn').disabled = false;
    }
}

/**
 * Populates the entire overview tab, including KPIs and dynamic strengths/weaknesses.
 */
function populateOverview(data) {
    // Populate KPI cards
    const kpiContainer = document.getElementById('overview-kpis');
    if (!kpiContainer) { console.error("Overview KPIs container not found."); return; }

    kpiContainer.innerHTML = `
        <div class="score-card"><h3 class="text-md font-medium text-gray-600">Latest Total Score</h3><p class="text-3xl font-bold score-value">${data.latestScores.total} <span class="text-lg text-gray-500">/ 1600</span></p></div>
        <div class="score-card"><h3 class="text-md font-medium text-gray-600">Latest R&W Score</h3><p class="text-3xl font-bold score-value">${data.latestScores.rw} <span class="text-lg text-gray-500">/ 800</span></p></div>
        <div class="score-card"><h3 class="text-md font-medium text-gray-600">Latest Math Score</h3><p class="text-3xl font-bold score-value">${data.latestScores.math} <span class="text-lg text-gray-500">/ 800</span></p></div>
        <div class="score-card"><h3 class="text-md font-medium text-gray-600">Avg EOC Score</h3><p class="text-3xl font-bold score-value">${data.latestScores.avgEocKhan}%</p></div>
        <div class="score-card"><h3 class="text-md font-medium text-gray-600">Your Target Score</h3><p class="text-3xl font-bold" style="color: #8a3ffc;">${data.targetScore}</p></div>`;

    // Populate Strengths & Weaknesses
    const allSkills = Object.values(data.skills).flat().filter(s => s.attempted);
    const strengths = [...allSkills].sort((a, b) => b.score - a.score).slice(0, 3);
    const weaknesses = [...allSkills].sort((a, b) => a.score - b.score).slice(0, 3);

    const renderList = (items) => items.map(item => `<li>${item.name} (${item.score}%)</li>`).join('');
    document.getElementById('overviewStrengthsContainer').innerHTML = `<ul class="list-disc list-inside space-y-1 text-gray-600">${renderList(strengths)}</ul>`;
    document.getElementById('overviewImprovementsContainer').innerHTML = `<ul class="list-disc list-inside space-y-1 text-gray-600">${renderList(weaknesses)}</ul>`;

    // Populate Time Spent
    document.getElementById('timeSpentOverview').innerHTML = `<p class="text-gray-600">Your Avg: <span class="font-semibold">${data.timeSpent.studentAvg} ${data.timeSpent.studentUnit}</span></p><p class="text-gray-600">Class Avg: <span class="font-semibold">${data.timeSpent.classAvg} ${data.timeSpent.classUnit}</span></p>`;
}

/**
 * Renders the main overview charts.
 * @param {object} data - The current student data.
 */
function initializeOverviewCharts(data) {
    ['scoreTrendChart', 'overallSkillChart'].forEach(id => {
        const instance = Chart.getChart(id);
        if (instance) instance.destroy(); // Destroy existing chart instance if it exists
    });

    // Score Trend Chart
    new Chart('scoreTrendChart', {
        type: 'line',
        data: {
            labels: data.scoreTrend.labels,
            datasets: [{
                label: 'Your Score',
                data: data.scoreTrend.studentScores,
                borderColor: '#2a5266',
                tension: 0.1
            }, {
                label: 'Class Average',
                data: data.scoreTrend.classAvgScores,
                borderColor: '#757575',
                borderDash: [5, 5],
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false, // Scores might not start at 0
                    suggestedMin: (Math.min(...data.scoreTrend.studentScores, ...data.scoreTrend.classAvgScores) > 0 ? Math.min(...data.scoreTrend.studentScores, ...data.scoreTrend.classAvgScores) : 1000) - 50, // Prevent negative if data is low or zero
                    suggestedMax: (Math.max(...data.scoreTrend.studentScores, ...data.scoreTrend.classAvgScores) > 0 ? Math.max(...data.scoreTrend.studentScores, ...data.scoreTrend.classAvgScores) : 1200) + 50,
                    title: {
                        display: true,
                        text: 'Total Score'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });

    // Overall Skill Performance Chart
    new Chart('overallSkillChart', {
        type: 'bar',
        data: {
            labels: data.overallSkillPerformance.labels,
            datasets: [{
                label: 'Your Accuracy',
                data: data.overallSkillPerformance.studentAccuracy,
                backgroundColor: 'rgba(42, 82, 102, 0.8)'
            }, {
                label: 'Class Average',
                data: data.overallSkillPerformance.classAvgAccuracy,
                backgroundColor: 'rgba(117, 117, 117, 0.7)'
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Accuracy (%)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });
}

// --- Subject-Specific Functions ---

/**
 * Populates the new combined "Skills Hub" tab.
 * This displays overall skill performance, sorted weakest first.
 * Clicking a skill here will open a modal showing incorrect questions for that skill.
 * @param {string} subject - The subject ('reading', 'writing', 'math').
 * @param {Array} skills - The list of skills for that subject.
 */
function populateSkillsHub(subject, skills) {
    const container = document.getElementById(`${subject}-skills-hub-body`);
    if (!container) return;

    skills.sort((a, b) => a.score - b.score); // Sort by weakest first

    if (skills.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center p-4">No skill data available for this subject.</p>';
        return;
    }

    container.innerHTML = skills.map(skill => {
        const performanceClass = skill.attempted ? (skill.score >= 85 ? 'performance-good' : skill.score >= 70 ? 'performance-average' : 'performance-poor') : 'performance-na';
        return `
        <div class="p-3 bg-gray-50 rounded-md border border-gray-200 mb-2 skill-item-container" onclick="openSkillIncorrectQuestionsModal('${skill.name}', '${subject}')">
            <div class="flex justify-between items-center mb-1">
                <span class="text-sm font-medium text-gray-800">${skill.name}</span>
                <span class="text-xs font-semibold">${skill.attempted ? skill.score + '%' : 'N/A'}</span>
            </div>
            <div class="progress-bar-container"><div class="progress-bar ${performanceClass}" style="width: ${skill.attempted ? skill.score : 0}%"></div></div>
            <p class="text-xs text-gray-500 mt-1">Class Avg: ${skill.classAvg}%</p>
        </div>`;
    }).join('');
}


/**
 * Populates the main table of CB Practice Tests.
 * Each row is clickable to open a modal with all questions from that test.
 * @param {Array} tests - Array of CB practice test objects.
 */
function populatePracticeTestsTable(tests) {
    const tableBody = document.getElementById('cb-practice-tests-table-body');
    if (!tableBody) return;

    if (tests.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center text-gray-500">No CB Practice Test data available.</td></tr>';
        return;
    }

    tableBody.innerHTML = tests.map(test => {
        const isAttempted = test.date !== "Not Attempted" && test.date !== "-" && test.date !== null && test.date !== undefined;
        return `
        <tr class="${isAttempted ? 'clickable-row' : 'opacity-60'}" ${isAttempted ? `onclick="openTestQuestionsModal('${test.name}')"` : ''}>
            <td>${test.name}</td>
            <td>${formatDate(test.date)}</td>
            <td>${test.rw}</td>
            <td>${test.math}</td>
            <td>${test.total}</td>
        </tr>`;
    }).join('');
}

/**
 * Populates EOC Practice tables.
 * Each row (quiz) is clickable to open a modal with all questions from that quiz.
 * @param {string} subject - The subject ('reading', 'writing', 'math').
 * @param {Array} quizzes - Array of EOC quiz objects.
 */
function populateEOCPractice(subject, quizzes) {
    const tableBody = document.getElementById(`${subject}-eoc-tbody`);
    if (!tableBody) return;

    // Dynamically generate table header for EOC quizzes based on first quiz structure
    const eocThead = document.getElementById(`${subject}-eoc-thead`);
    if (eocThead) { // Only update if thead exists
        const headers = ['Quiz Name', 'Date Attempted', 'Latest Score'];
        eocThead.innerHTML = `<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
    }

    if (quizzes.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="3" class="text-center text-gray-500">No EOC practice data available.</td></tr>`;
        return;
    }

    tableBody.innerHTML = quizzes.map(quiz => `
        <tr class="clickable-row" onclick="openEOCQuizQuestionsModal('${quiz.name}', '${subject}')">
            <td>${quiz.name}</td>
            <td>${formatDate(quiz.date)}</td>
            <td>${quiz.latestScore}</td>
        </tr>
    `).join('');
}

/**
 * Populates Khan Academy Practice sections.
 * (Currently just a placeholder as dummy data is empty for Khan)
 * @param {string} subject - The subject ('reading', 'writing', 'math').
 * @param {Array} khanData - Array of Khan Academy data.
 */
function populateKhanAcademy(subject, khanData) {
    const container = document.getElementById(`${subject}-khan-data`);
    if (!container) return;

    if (khanData.length === 0) { // If there's no data from CSVs
        container.innerHTML = '<p class="text-gray-500 text-center p-4">No Khan Academy data available.</p>';
        return;
    }
    // Implement rendering for Khan Academy data here when real data is available
    container.innerHTML = `<p class="text-gray-500 text-center p-4">Khan Academy data for ${subject} will be displayed here.</p>`;
}

// --- Modals and Detailed View Functions ---

const modal = document.getElementById('detailModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

/**
 * Opens the modal to show ALL incorrect questions for a specific skill,
 * triggered from the "Skills Hub" (by clicking a skill performance bar).
 * Questions are sorted by difficulty.
 * @param {string} skillName - The name of the skill to filter by.
 * @param {string} subject - The subject of the skill (e.g., 'reading').
 */
function openSkillIncorrectQuestionsModal(skillName, subject) {
    modalTitle.textContent = `Incorrect Questions for: ${skillName} (${subject.charAt(0).toUpperCase() + subject.slice(1)})`;

    // Filter all questions for the specific skill and ensure they are incorrect
    const incorrectQuestions = ALL_DASHBOARD_QUESTIONS.filter(q =>
        q.skill === skillName && !q.isCorrect && q.subject === subject
    );

    // Sort by difficulty: Hard > Medium > Easy
    const difficultyOrder = { "Hard": 1, "Medium": 2, "Easy": 3 };
    incorrectQuestions.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);

    if (incorrectQuestions.length === 0) {
        modalBody.innerHTML = `<p class="text-center p-5 text-gray-600">No incorrect questions found for "${skillName}" in ${subject}. Great work!</p>`;
    } else {
        // Render each question as a detailed analysis card (without pacing here)
        modalBody.innerHTML = incorrectQuestions.map((q, index) => renderQuestionAnalysisCard(q, `skill-${index}`, false)).join('');
    }
    modal.style.display = "block";
    renderDynamicCharts(); // Render charts AFTER content is in the DOM
    addExplanationToggleListeners(); // Add listeners for explanation toggles
}

/**
 * Opens the modal to show ALL questions for a specific CB Practice Test,
 * and includes a pacing analysis table at the bottom.
 * @param {string} testName - The name of the test.
 */
function openTestQuestionsModal(testName) {
    modalTitle.textContent = `Reviewing Test: ${testName}`;
    const test = currentStudentData.cbPracticeTests.find(t => t.name === testName);

    if (!test || !test.questions || test.questions.length === 0) {
        modalBody.innerHTML = `<p class="text-center p-5 text-gray-600">No question details found for ${testName}.</p>`;
        modal.style.display = "block";
        return;
    }

    // Render each question as a single question analysis card, including pacing
    let content = test.questions.map((q, index) => renderQuestionAnalysisCard(q, `test-${index}`, true)).join('');

    // Append pacing analysis at the bottom if pacing data exists
    if (test.questions.some(q => q.yourTime !== undefined && q.classAvgTime !== undefined)) {
        content += `<h3 class="text-lg font-semibold text-gray-800 border-t pt-4 mt-6">Pacing Analysis</h3>`;
        content += `<div class="pacing-bar-chart-container"><canvas id="pacingBarChart"></canvas></div>`;

        const pacingRows = test.questions.map((p, index) => {
            const diff = p.yourTime - p.classAvgTime;
            const status = diff > (p.classAvgTime * 0.2) ? 'Slower' : diff < -(p.classAvgTime * 0.2) ? 'Faster' : 'On Pace'; // Pacing based on 20% diff
            const statusClass = `pacing-${status.toLowerCase().replace(' ', '-')}`;
            return `<tr><td>${index + 1}</td><td>${p.yourTime}s</td><td>${p.classAvgTime}s</td><td><span class="pacing-badge ${statusClass}">${status}</span></td><td class="${p.isCorrect ? 'text-good' : 'text-poor'} font-semibold">${p.isCorrect ? 'Correct' : 'Incorrect'}</td></tr>`;
        }).join('');
        content += `<div class="overflow-x-auto mt-4"><table class="min-w-full table"><thead><tr><th>Q#</th><th>Your Time</th><th>Class Avg</th><th>Pacing</th><th>Result</th></tr></thead><tbody>${pacingRows}</tbody></table></div>`;
    }

    modalBody.innerHTML = content;
    modal.style.display = "block";
    renderDynamicCharts(); // Render donut charts AFTER content is in the DOM
    addExplanationToggleListeners(); // Add listeners for explanation toggles
    if (test.questions.some(q => q.yourTime !== undefined)) {
        renderPacingBarChart('pacingBarChart', test.questions);
    }
}

/**
 * Opens the modal to show ALL questions for a specific EOC Quiz.
 * Pacing data is NOT included for EOC quizzes.
 * @param {string} quizName - The name of the EOC quiz.
 * @param {string} subject - The subject of the EOC quiz.
 */
function openEOCQuizQuestionsModal(quizName, subject) {
    modalTitle.textContent = `Reviewing EOC Quiz: ${quizName} (${subject.charAt(0).toUpperCase() + subject.slice(1)})`;
    const quizzesForSubject = currentStudentData.eocQuizzes[subject] || [];
    const quiz = quizzesForSubject.find(q => q.name === quizName);

    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
        modalBody.innerHTML = `<p class="text-center p-5 text-gray-600">No questions found for ${quizName}.</p>`;
        modal.style.display = "block";
        return;
    }

    // Render each question as a single question analysis card, without pacing info
    let content = quiz.questions.map((q, index) => renderQuestionAnalysisCard(q, `eoc-${index}`, false)).join(''); // `false` for pacing

    modalBody.innerHTML = content;
    modal.style.display = "block";
    renderDynamicCharts(); // Render donut charts AFTER content is in the DOM
    addExplanationToggleListeners(); // Add listeners for explanation toggles
}


/**
 * Closes the modal and cleans up any Chart.js instances to prevent memory leaks.
 */
function closeModal() {
    // Destroy all Chart.js instances within the modal body
    const canvases = modalBody.querySelectorAll('canvas');
    canvases.forEach(canvas => {
        const chart = Chart.getChart(canvas);
        if (chart) {
            chart.destroy();
        }
    });

    modal.style.display = "none";
    modalBody.innerHTML = ''; // Clear content to prevent old data flashing
}
window.onclick = (event) => {
    if (event.target == modal) {
        closeModal();
    }
};

// --- Reusable HTML Renderer for a Single Question ---

/**
 * Renders a self-contained card for a single question's analysis.
 * This function now includes class performance percentage, a mini donut,
 * and a toggle for explanation.
 * @param {object} q - The question object.
 * @param {string} uniqueIdPrefix - A unique prefix for element IDs within the card (e.g., 'skill-0-Q1', 'test-1-Q5').
 * @param {boolean} includePacing - Whether to show the pacing information for this question.
 * @returns {string} - The HTML string for the card.
 */
function renderQuestionAnalysisCard(q, uniqueIdPrefix, includePacing = false) {
    const resultText = q.isCorrect ? "Correct" : "Incorrect";
    const resultClass = q.isCorrect ? "text-good" : "text-poor";
    const sourceInfo = q.source ? `<span class="meta-item text-gray-500">Source: ${q.source}</span>` : '';
    const questionTextDisplay = q.text ? `<p class="mb-2 text-gray-800 font-medium">${q.text}</p>` : `<p class="mb-2 text-gray-800 font-medium">Question ID: ${q.id}</p>`;

    const pacingHtml = includePacing && q.yourTime !== undefined ?
        `<p class="text-center text-sm mt-2">Pacing: <strong>${q.yourTime}s</strong> (Class Avg: ${q.classAvgTime}s)</p>` : '';

    const classCorrectPercentage = q.classPerformance ? q.classPerformance.correct : 'N/A';

    const explanationHtml = q.explanation ? `
        <button class="toggle-explanation-btn" data-target="explanation-${uniqueIdPrefix}-${q.id}">Show Explanation</button>
        <div id="explanation-${uniqueIdPrefix}-${q.id}" class="answer-explanation">
            <p class="font-semibold text-sm">Explanation</p>
            <p class="text-sm">${q.explanation}</p>
        </div>
    ` : '';

    // Get relevant chapters for review based on skill
    const relevantChapters = getChaptersForSkill(q.skill, q.subject);
    const chapterReviewHtml = relevantChapters.length > 0 ? `
        <div class="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200 text-sm">
            <p class="font-semibold text-blue-800 mb-1">Review Chapters:</p>
            <ul class="list-disc list-inside text-blue-700">
                ${relevantChapters.map(chapter => `<li>${chapter}</li>`).join('')}
            </ul>
        </div>
    ` : '';

    return `
    <div class="question-analysis-card">
        <div class="question-analysis-header">
            <span class="font-semibold text-gray-700">${q.skill}</span>
            <span class="difficulty-badge difficulty-${q.difficulty}">${q.difficulty}</span>
            ${sourceInfo}
        </div>
        <div class="question-analysis-body">
            <div>
                ${questionTextDisplay}
                <p>Your Answer: <span class="font-semibold ${resultClass}">${q.yourAnswer || 'N/A'}</span> <span class="font-bold">(${resultText})</span></p>
                ${!q.isCorrect ? `<p>Correct Answer: <span class="font-semibold text-good">${q.correctAnswer || 'N/A'}</span></p>` : ''}
                ${explanationHtml}
                ${chapterReviewHtml}
            </div>
            <div>
                <p class="text-center text-sm font-semibold mb-2">Class Performance: ${classCorrectPercentage}% Correct</p>
                <div class="question-chart-container">
                    <canvas id="chart-${uniqueIdPrefix}-${q.id}"></canvas>
                </div>
                ${pacingHtml}
            </div>
        </div>
    </div>`;
}

/**
 * Retrieves relevant chapters from the SAT_CHAPTER_SKILL_MAPPING for a given skill and subject.
 * @param {string} skillName - The skill name.
 * @param {string} subject - The subject (e.g., 'math', 'reading', 'writing').
 * @returns {string[]} An array of chapter names.
 */
function getChaptersForSkill(skillName, subject) {
    const chapters = new Set(); // Use a Set to avoid duplicate chapter names
    const skillMap = SAT_CHAPTER_SKILL_MAPPING[subject];

    if (skillMap) {
        // Iterate through the mapping to find all chapters associated with the skill
        for (const mappedSkill in skillMap) {
            // Check if the skill name is a part of the mapped skill or vice versa
            // This allows for partial matches or variations in skill names
            if (skillName && mappedSkill &&
                (skillName.toLowerCase().includes(mappedSkill.toLowerCase()) ||
                 mappedSkill.toLowerCase().includes(skillName.toLowerCase()))) {
                skillMap[mappedSkill].forEach(chapter => chapters.add(chapter));
            }
        }
    }
    return Array.from(chapters).sort(); // Convert Set to Array and sort for consistent order
}


/**
 * Renders dynamic Chart.js charts for canvases present in the modalBody.
 * This must be called *after* the HTML content with the canvas elements is in the DOM.
 */
function renderDynamicCharts() {
    const canvases = modalBody.querySelectorAll('canvas[id^="chart-"]'); // Select all question charts
    canvases.forEach(canvas => {
        const chartId = canvas.id;
        const existingChart = Chart.getChart(chartId);
        if (existingChart) {
            existingChart.destroy(); // Destroy existing chart instance to prevent duplicates
        }

        // Extract original question ID from the chartId (e.g., "chart-skill-0-Q1" where Q1 is the id)
        const parts = chartId.split('-');
        // The question ID is typically the last part, but could be specific like DT-Q1
        // Reconstruct based on knowing the ID format.
        const qId = parts.slice(2).join('-'); // Joins parts starting from index 2, e.g., "DT-Q1" from "chart-test-0-DT-Q1"

        const qData = ALL_DASHBOARD_QUESTIONS.find(q => q.id === qId);

        if (qData && qData.classPerformance) {
            const correct = qData.classPerformance.correct || 0;
            const incorrect = qData.classPerformance.incorrect || 0;
            const unanswered = qData.classPerformance.unanswered || 0;

            new Chart(canvas, {
                type: 'doughnut',
                data: {
                    labels: ['Correct', 'Incorrect', 'Unanswered'],
                    datasets: [{
                        data: [correct, incorrect, unanswered],
                        backgroundColor: ['#28a745', '#dc3545', '#ffc107'], // Green, Red, Yellow
                        borderColor: '#ffffff',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom',
                            labels: {
                                boxWidth: 12,
                                font: {
                                    size: 10
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed !== null) {
                                        label += context.parsed + '%';
                                    }
                                    return label;
                                }
                            }
                        }
                    },
                    cutout: '60%', // Makes it a donut
                }
            });
        }
    });
}

/**
 * Renders a bar chart for pacing analysis.
 * @param {string} canvasId - The ID of the canvas element.
 * @param {Array} questions - An array of question objects with pacing data.
 */
function renderPacingBarChart(canvasId, questions) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const existingChart = Chart.getChart(canvasId);
    if (existingChart) {
        existingChart.destroy();
    }

    const labels = questions.map((q, index) => `Q${index + 1}`);
    const yourTimes = questions.map(q => q.yourTime);
    const classAvgTimes = questions.map(q => q.classAvgTime);

    const backgroundColors = questions.map(q => {
        const diff = q.yourTime - q.classAvgTime;
        const avgTimeForCalc = q.classAvgTime > 0 ? q.classAvgTime : 1; // Avoid division by zero
        if (diff > (avgTimeForCalc * 0.2)) return '#dc3545'; // Slower (Red)
        if (diff < -(avgTimeForCalc * 0.2)) return '#28a745'; // Faster (Green)
        return '#4b5563'; // On Pace (Grey/Blue - similar to theme)
    });

    const borderColors = questions.map(q => {
        const diff = q.yourTime - q.classAvgTime;
        const avgTimeForCalc = q.classAvgTime > 0 ? q.classAvgTime : 1; // Avoid division by zero
        if (diff > (avgTimeForCalc * 0.2)) return '#bb2124';
        if (diff < -(avgTimeForCalc * 0.2)) return '#198754';
        return '#2a5266';
    });

    new Chart(canvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Your Time (s)',
                    data: yourTimes,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1,
                    barPercentage: 0.8,
                    categoryPercentage: 0.8
                },
                {
                    label: 'Class Avg Time (s)',
                    data: classAvgTimes,
                    backgroundColor: 'rgba(117, 117, 117, 0.5)', // Lighter grey for class average
                    borderColor: 'rgba(117, 117, 117, 0.8)',
                    borderWidth: 1,
                    type: 'line', // Make class avg a line on top of bars
                    fill: false,
                    pointRadius: 3,
                    pointBackgroundColor: '#757575',
                    tension: 0.1,
                    hidden: false // Ensure this dataset is visible
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        title: function(context) {
                            return context[0].label; // Q#
                        },
                        label: function(context) {
                            if (context.dataset.label === 'Your Time (s)') {
                                const qIndex = context.dataIndex;
                                // Find the question data from the list of questions passed to this function
                                const question = questions[qIndex];
                                const difficulty = question ? question.difficulty : 'N/A';
                                return `${context.dataset.label}: ${context.parsed.y}s (Difficulty: ${difficulty})`;
                            }
                            return `${context.dataset.label}: ${context.parsed.y}s`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Question Number'
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Time (seconds)'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}


/**
 * Adds event listeners to "Show Explanation" buttons to toggle explanation visibility.
 * This needs to be called every time new content is loaded into the modalBody.
 */
function addExplanationToggleListeners() {
    modalBody.querySelectorAll('.toggle-explanation-btn').forEach(button => {
        button.onclick = function() {
            const targetId = this.getAttribute('data-target');
            const explanationDiv = document.getElementById(targetId);
            if (explanationDiv) {
                explanationDiv.classList.toggle('expanded');
                this.textContent = explanationDiv.classList.contains('expanded') ? 'Hide Explanation' : 'Show Explanation';
            }
        };
    });
}
