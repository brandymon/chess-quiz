import { QuizModel, viennaGambitAcceptedQuiz, viennaGambitDeclinedNc6Quiz } from "./quiz_model";

export interface CourseModel {
    name: string,
    initialPosition: string,
    lines: QuizModel[]
}

export const ViennaGameCourse: CourseModel = {
    name: "The Vienna Game",
    initialPosition: "rnbqkbnr/pppp1ppp/8/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq - 1 2",
    lines: [viennaGambitAcceptedQuiz, viennaGambitDeclinedNc6Quiz]
}