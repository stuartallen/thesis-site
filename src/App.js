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
    ],
  Derivative:
    [
      { latex: String.raw`\frac{d}{d\theta_1}`, explanation: 'The derivative with respect to the weight of the first cluster'},
      { latex: String.raw`\sum_{i=1}^n`, explanation: 'The sum of n data points'},
      { latex: String.raw`log(`},
      { latex: String.raw`\theta_1`, explanation: 'The likelihood assosciated with cluster 1'},
      { latex: String.raw`\frac{1}{\sigma_1 \sqrt{2\pi}}e^{-\frac{1}{2}(\frac{x - \mu_1}{\sigma_1})^2} + `, explanation: 'The probability density function assosciated with cluster 1'},
      { latex: String.raw`\theta_2`, explanation: 'The likelihood assosciated with cluster 2'},
      { latex: String.raw`\frac{1}{\sigma_2 \sqrt{2\pi}}e^{-\frac{1}{2}(\frac{x - \mu_1}{\sigma_2})^2})`, explanation: 'The probability density function assosciated with cluster 2'}
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
        correctness={[true, false, false]}
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
      <Question 
        question={'Which density estimator better represents this data'}
        visual={'singularityDemo'}
        options={['left', 'right']}
        expandedOptions={['Incorrect. Even if this lowers the loss of the model, outliers should not be explained away by an entirely new distribution','Correct. Even if this model has more loss, it does not overemphasize outliers']}
        correctness={[false, true]}
      />
      <Question
        question={'Which density estimator better represents this data'}
        visual={'clusterNumberDemo'}
        options={['left', 'right']}
        expandedOptions={['Incorrect. Even if this lowers the loss of the model, this data is clearly from only 2 distributions','Correct. Even if this model has more loss it clearly reflects the number of clusters this data was generated from']}
        correctness={[false, true]}
      />
      <Question
        question={'Which clustering was likely generated by K-means?'}
        visual={'kmeans'}
        options={['left', 'right']}
        expandedOptions={['Correct. As K-means is not robust to covariance and breaks down at the edges of these distributions','Incorrect. K-means is not robust to covariance and would struggle to exactly label these distributions at the edges']}
        correctness={[true, false]}
      />
      <Question 
        question={"In order to directly solve a GMM in a one dimensional case with two clusters, this is just one of the derivatives we must find the roots of. Which terms will appear after the deriviative operator is applied?"}
        eqPieces={equations.Derivative}
        options={[
          'The weights of both clusters', 
          'The means and variances of each cluster', 
          'The means, variances, and weights of each cluster'
        ]}
        expandedOptions={[
          'Incorrect. The exponential parts of each function will affect the derivative', 
          'Incorrect. The weights will be included in the derivative',
          'Correct. Every term from the original expression will be a part of our derivative we must solve'
        ]}
        correctness={[false, false, true]}
      />
      <Screen scene={"normalMix"}/>
      <Screen scene={"lineIntegral"}/>
      <Screen scene={"emVisualization"}/>
    </div>
  );
}

export default App;