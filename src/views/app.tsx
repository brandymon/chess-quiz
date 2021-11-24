
import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";
import OpeningView from "./opening_view";
import QuizView from "./quiz_view";
import RepertoireView from "./repertoire_view";

export default function App() {
    return (
        <BrowserRouter basename="chess-quiz">
            <Routes>
                <Route path="/" element={<RepertoireView/>}/>
                <Route path="/opening/:openingID" element={<OpeningView/>}/>
                <Route path="/opening/:openingID/:lineID" element={<QuizView/>}/>
            </Routes>
        </BrowserRouter>
    )
}