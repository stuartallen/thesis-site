import './App.css';
import Question from './components/Question';

import { Canvas } from '@react-three/fiber';

//  My scripts

//  My components
import Screen from './components/Screen';

//  Equation data
const equations = {
  MaximizationStep:
    [
      { latex: String.raw`New\:distribution\:parameters = `, explanation: 'What the parameters of the distribution we are trying to learn will be updated to'},
      { latex: String.raw`\underset{distribution\:parameters}{\mathrm{argmax}}`, explanation: 'Maximize the following expression with respect to the distribution parameters'},
      { latex: String.raw`LL(Missing Data\:|distribution\:parameters)`, explanation: "The log likelihood of the data we are trying to learn given the parameters of our distribution"}
    ],
  ExpectationStep:
    [
      { latex: String.raw`Missing\:Data\:Estimate =`},
      { latex: String.raw`E(LL(Missing\:Data|distribution\:parameters\:estimate))`, explanation: 'The expected value of the log likelihood of the missing data given our parameter estimate'}
    ]
}

function App() {

  return (
    <div className="App">
      <Question 
        question={"Given the below intuition of the Maximization step of the EM algorithm, what parameters should be updated in our case?"}
        eqPieces={equations.MaximizationStep}
        options={[
          'The mean, covariance, and probability assignment of each cluster', 
          'The mean and covariance of each cluster and the likelihoods of each point', 
          'The likelihoods of each point'
        ]}
        expandedOptions={[
          'Correct, the mean and covariance correspond to the distribution we are trying to learn', 
          'Incorrect. The likelihoods of each point correspond to our missing data which should not be updated at this step',
          'Incorrect. The likelihoods of each point correspond to our missing data which should not be updated at this step'
        ]}
        correctness={[true, false]}
      />
      <Question 
        question={'Given the below intuition of the Expectation step of the EM algorithm, what parameters should be updated in our case'}
        eqPieces={equations.ExpectationStep}
        options={[
          'The mean, covariance, and probability assignment of each cluster', 
          'The mean and covariance of each cluster and the likelihoods of each point', 
          'The likelihoods of each point'
        ]}
        expandedOptions={[
          'Incorrect. This information is assosciated our distribution parameters', 
          'Incorrect. The means and covariances are assosciated with our distribution parameters',
          'Correct. The likelihoods of each point correspond to our missing data'
        ]}
        correctness={[false, false, true]}
      />
      <Question 
        question={'Which density estimator better represents this data'}
        visual={'covarianceDemo'}
        options={['Left','Right']}
        expandedOptions={['Correct. This option allows for covariance in the density estimator', 'Incorrect. The left cluster of the density estimator has the same covariance as the right, which is not reflected in the dataset']}
        correctness={[true, false]}
      />
      <Screen scene={"normalMix"}/>
      <Screen scene={"lineIntegral"}/>
      <Screen scene={"emVisualization"}/>
    </div>
  );
}

export default App;