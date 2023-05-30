import React, { useState, useEffect } from 'react';
import './App.css';
import EMVWrapper from './components/EMVWrapper';
import Question from './components/Question';

//  My components
import Screen from './components/Screen';
import useColor from './hooks/useColor';
import Expression from './components/Expression';

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
    ],
  SoftAssignments: [
    { latex: String.raw`\gamma = `, explanation: 'Let\'s use gamma to represent the soft assignments'},
    { latex: String.raw`[\frac{\pi_1p(x|\mu_1,\Sigma_1)}{p(x|\mu, \Sigma, \pi)}]`, explanation: 'The probability a data point came from the first individual Gaussian distribution'},
    { latex: String.raw`, ..., `},
    { latex: String.raw`[\frac{\pi_kp(x|\mu_k,\Sigma_k)}{p(x|\mu, \Sigma, \pi)}]`, explanation: 'The probability a data point came from the last individual Gaussian distribution'}
  ],
  MVGFormula: [
    { latex: String.raw`p(x|`, explanation: 'The relative probability of a point x given...'},
    { latex: String.raw`\mu,`, explanation: 'The distribution\'s mean'},
    { latex: String.raw`\Sigma)`, explanation: 'The distribution\'s covariance matrix'},
    { latex: String.raw` = \frac{1}{\sqrt{(2\pi)^k|\Sigma|}}e^{\frac{1}{2}(x - \mu)\Sigma^{-1}(x - \mu)^T}`}
  ],
  MVGMMFormula: [
    { latex: String.raw`p(x|`, explanation: 'The relative probability of a point x...'},
    { latex: String.raw`\mu,`, explanation: 'A list of means corresponding to each individual distribution'},
    { latex: String.raw`\Sigma,`, explanation: 'A list of covariance matrices corresponding to each individual distribution'},
    { latex: String.raw`\pi`, explanation: 'A list of individual weights assosciated with each individual distribution'},
    { latex: String.raw`) = `},
    { latex: String.raw`\sum_{i=1}^{k}`, explanation: 'The sum from 1 to k individual distributions'},
    { latex: String.raw`\pi_ip(x|\mu_i,\Sigma_i)`, explanation: 'The relative probability of x in one individual distribution multiplied by its individual weight'}
  ],
  weightUpdate: [
    { latex: String.raw`\pi^*_i`, explanation: 'The updated value of the ith weight in our Gaussian mixture model'},
    { latex: String.raw` = `},
    { latex: String.raw`\sum_{n=1}^N\gamma_{ni}`, explanation: 'The sum of the soft assignments for data point n, that is assosciated with distribution i'},
    { latex: String.raw`/ N`, explanation: ' Divided by the total number of data points'}
  ],
  meanUpdate: [
    { latex: String.raw`\mu^*_i`, explanation: 'The updated value of the ith mean in our Gaussian mixture model'},
    { latex: String.raw` = `},
    { latex: String.raw`\frac{1}{\sum_{n=1}^N\gamma_{ni}}`, explanation: 'The reciprocal of the sum of the soft assignments for data point n, that is assosciated with distribution i'},
    { latex: String.raw`\sum_{n=1}^N\gamma_{ni}x_n`, explanation: 'The weighted sum of each data point multiplied by its soft assignment for the distribution being updated'}
  ],
  covUpdate: [
    { latex: String.raw`\Sigma^*_i`, explanation: 'The updated covariance matrix of the ith individual distribution in our Gaussian mixture model'},
    { latex: String.raw` = `},
    { latex: String.raw`\frac{1}{\sum_{n=1}^N\gamma_{ni}}`, explanation: 'The reciprocal of the sum of the soft assignments for data point n, that is assosciated with distribution i'},
    { latex: String.raw`\sum_{n=1}^N\gamma_{ni}(x_n - \mu^*_i)(x_n - \mu^*_i)^T`, explanation: 'The weighted sum of the covariance of each data point with the updated mean multiplied by the data points soft assignment for the distribution being updated'}
  ],
  GMMLL: [
    { latex: String.raw`log(\prod_{n=1}^Np(x|\mu,\Sigma,\pi))`, explanation: 'The log of the product of the likelihood of each data point, given our distribution parameters'}
  ]
}

function App() {
  const [ windowWidth, setWindowWidth] = useState(window.innerWidth)

  const updateWindowWidth = () => {
    setWindowWidth(window.innerWidth)
  }

  const textColor = useColor('dark')

  useEffect(() => {
    window.addEventListener('resize', updateWindowWidth)

    document.documentElement.style.setProperty('--text-color', textColor)
    document.documentElement.style.setProperty('--content-width', windowWidth < 600 ? '90%' : '75%')

    return () => {
        window.removeEventListener('resize', updateWindowWidth)
    }
  })

  return (
    <div className="App" style={{backgroundColor: useColor('light')}}>
      <h1>An Introduction to Gaussian Mixture Models</h1>
      <h3>Our example problem, Avoiding Mountain Lions</h3>
      <div className='explanation'>
        Suppose we are beginning a hike through a region known for its mountain lions. At the beginning of our trek, we have access to a map
        with our trails, as well as the coordinates of every recent mountain lion sighting. Our goal is to choose the trail where we are least
        likely to find a mountain lion.
      </div>
      <img className='outerImg' src='updatedFirstExample.png' alt='An Image of Two Hiking Paths with Cougar Siting' />
      <div className='explanation'>
        How might we approach this problem? In some cases it may be trivial if sightings are clearly localized around a certain path. However,
        this will not always be the case. For example, suppose one path is much longer than another, and the shorter path goes directly through
        a cluster of sightings. While it's best to avoid going directly through a cluster of sightings, a longer path presents more opportunities
        to meet these creatures as well. How can we make a decision about which path to choose in these less than obvious situations?
      </div>
      <img className='outerImg' src='updatedInconclusive.png' alt='Another Image of Two Hiking Paths with Cougar Siting' />
      <div className='explanation'>
        What if we could approximate the relative likelihood of seeing a mountain lion at any point on our map? With that information we could take the sum of these
        relative likelihoods at each point along a path. This would give us a total probability of seeing a mountain lion for a certain path. Then we could
        simply compare these total probabilities for each path to see which one is best!
      </div>
      <div className='explanation'>
        But how is it possible to transform a set of sightings into a probability of seeing a mountain lion at any point in our map? This can be
        accomplished with Gaussian Mixture Models.
      </div>

      <h3>What is a Gaussian Mixture Model?</h3>
      <div className='explanation'>
        Gaussian distributions are also known as normal distributions, as well as Bell curves. This kind of distribution has two important parameters:
        mean and variance. The mean of a distribution describes the point at which the largest values of the function are centered around, the variance
        describes how spread out the values of the function are. Use the below graphing tool to experiment with the parameters.
      </div>
      <iframe src="https://www.desmos.com/calculator/1ofrbbnzhd" width="500" height="500" ></iframe>
      <div className='explanation'>
        You have likely seen this kind of distribution before, however, you may not have seen a multivariate Gaussian distribution. A multivariate Gaussian
        distribution has many similarities to its one dimensional counterpart. It has a mean where most of the highest values of the function are centered
        around, as well as a covariance matrix that describes how spread the values of the function are.
      </div>
      <Screen scene={"singleGaussian"}/>
      <div className='explanation'>
        Mutlidimensional Gaussian distributions also have covariance properties. This means the spread of the function may be circular, longer with respect to one
        axis, or diagonal. The flexibility of multivariate Gaussian distribution's mean and covariance parameters makes them useful for our problem. For example, the sightings
        of one particular mountain lion on a map may well follow a distribution like this.
      </div>
      <Screen scene={"singleGaussianDiagonal"}/>
      <div className='explanation'>
        <p>
          More formally a multivariate Gaussian has the following probability density function at any point x, in a distribution with d dimensions as written below.&nbsp;<a href='#bishop'>[1]</a>
        </p>
      </div>
      <Expression pieces={equations.MVGFormula}/>
      <div className='explanation'>
        If the sightings of one mountain lion follow a multivariate Gaussian distribution, perhaps a mixture of these distributions can describe the
        sighting activity of several. A mixture of Gaussians can be made from a weighted sum of two or more distributions. Applying a weight to each
        individual distribution is necessary as the sum of all values in a probability distribution must add to 100%. Using different weights for
        individual distributions increases the flexibility of our mixture. Observe a Gaussian mixture in the one dimensional case:
      </div>
      <iframe src="https://www.desmos.com/calculator/9hwtlkgsot" width="500" height="500" ></iframe>
      <div className='explanation'>
        As well as a multivariate Gaussian mixture:
      </div>
      <Screen scene={"normalMix"}/>
      <div className='explanation'>
        A multivariate Gaussian mixture model has the probability density function below.&nbsp;<a href='#bishop'>[1]</a>
      </div>
      <Expression pieces={equations.MVGMMFormula}/>
      <div className='explanation' id='densityEstimator'>
        <p>
          All Gaussian mixture models are <strong>density estimators</strong>, meaning they describe how relatively likely a particular point is. We will use multivariate 
          Gaussian mixtures to find a good density estimator of the likelihood of seeing a mountain lion at any point on our map.
        </p>
      </div>

      <h3 id="logLikelihood">Evaluating the Fit of a Gaussian Mixture</h3>

      <div className='explanation'>
        <p>
          The fit of a Gaussian mixture can be measured in many ways, but a popular choice is the <strong>log likelihood expression</strong>. The log likelihood is simply
          the log of the product of the probability of each data point in a dataset, given our distribution parameters. For Gaussain mixture models the log
          likelihood expression can be written as below.&nbsp;<a href='#bishop'>[1]</a>
        </p>
      </div>
      <Expression pieces={equations.GMMLL}/>
      <div className='explanation'>
        Holding the number of clusters constant a mixture with a higher log likelihood than another is usually a better representation of the data. However, there
        are important exceptions, such as if one individual distribution of a Gaussian mixture model centers around an outlier and has a small covariance matrix.
      </div>
      <div className='explanation'>
        Increasing the number of individual normal distributions within a mixture generally increases the log likelihood until the number of distributions reaches the number of datapoints. This is because each distribution
        can be responsible for less of the data until it only represents one data point. In this manner if we optimize with respect to number of clusters, we learn nothing about
        the distribution underlying the data. Instead, there is typically a point where increasing the number of clusters presents diminishing returns for the likelihood. Choosing 
        a value where the diminishing returns begin typically yields a reasonable number of clusters to represent the data. This shows that just because a Gaussian mixture model
        has more individual distributions, it is not necessarily a better representation of a data set.
      </div>

      <h3>Check your Understanding</h3>
      <div className='explanation'>
        The following questions contain visualizations of Gaussian mixtures model distributions and data in a plane. Given what you've just learned about Gaussian
        mixture models, answer the following questions:
      </div>

      <Question 
        question={'Each point on the grid below represents one data point in a data set. Which density estimator fits this data set better?'}
        visual={'covarianceDemo'}
        options={['Left','Right']}
        expandedOptions={
          ['Correct. A non-cirular distribution does a better job representing how spread how these data points are.', 
          'Incorrect. Using at least one non-circular distribution would better reflect how spread these data points are.'
        ]}
        correctness={[true, false]}
      />
      <Question 
        question={'Each point on the grid below represents one data point in a data set. Which density estimator fits this data set better?'}
        visual={'singularityDemo'}
        options={['Left', 'Right']}
        expandedOptions={
          ['Incorrect. Adding another individual Gaussian distribution to represent one outlier, is not a great strategy to represent a data set.',
          'Correct. This model does not overrepresent outliers in a data set.'
        ]}
        correctness={[false, true]}
      />
      <Question
        question={'Each point on the grid below represents one data point in a data set. Which density estimator fits this data set better?'}
        visual={'clusterNumberDemo'}
        options={['Left', 'Right']}
        expandedOptions={
          ['Incorrect. Given the data set points are localized around two areas. This could be better represented by two individual distributions, rather than 3.',
          'Correct. Using only two individual distributions represents that this data set has points localized around two areas.'
        ]}
        correctness={[false, true]}
      />

      <h3 id='lineIntegral'>Finding The Probability Of A Sighting Along A Path, Line Integrals Along A Gaussain Mixture Model</h3>
      <div className='explanation'>
        Now that we understand the kind of distribution our mountain lions sightings will follow, we can now find the probability of seeing a mountain
        lion on our observed path. We deduced earlier that if we take the sum of all the probabilities along one path, we would know the total probability
        of seeing a mountain lion along that path. This can be accomplished by what is called a line integral. A line integral more generally is the sum of 
        all the points under a multidimensional function along a line. Our multidimensional function is our multivariate Gaussian mixture. This kind of 
        distribution is difficult to calculate an exact line integral over. However, we can construct an approximation by splitting our line and the area 
        underneath into trapezoids. This more generally known as a Reimann sum approximation. Below is a visualization of the an approximate line integral
        over a Gaussian mixture, where the area of the orange cross section represents our desired probability:
      </div>
      <Screen scene={"lineIntegral"}/>

      <div className='explanation'>
        Now that we know what quantity we need given our Gaussian mixture model, all we need is to find which Gaussian mixture model works best for our data set.
      </div>

      <h3 id='MLE'>Why Gaussian Mixtures Cannot Be Learned Directly</h3>

      <div className='explanation'>
        <p>
          As we are only given the locations of mountain lion sightings, we must find a Gaussian mixture that best represents these sightings in order to
          build our <a href='#densityEstimator'>density estimator</a>. A typical method of learning the parameters of a distribution is <strong>maximum likelihood estimation</strong>
          &nbsp;(MLE). Many machine learning problems can be solved through directly maximizing the <a href='#logLikelihood'>log likelihood expression</a>. If our data is independent, meaning one mountain lion sighting does not influence another, the likelihood function of our
          data is a product of the likelihood of each data point given our distribution parameters: the mean and covariance. The log likelihood is a useful expression as it is a 
          monotonic function and therefore retains the same local and global maximums and minimums. Additionally, the log likelihood of a product usually reduces 
          to a sum which leads to a drastically simpler expression when applying the derivative operator with respect to one of a model’s parameters. In 
          many cases such as linear regression, a closed form solution is possible. Answer the following question to observe why this is not the case for optimizing Gaussian mixture models.
        </p>
      </div>

      <Question 
        question={"In order to directly solve a GMM in a one dimensional case with two clusters, this is just one of the derivatives we must find the roots of. Which terms will appear in the resulting expression after the deriviative operator is applied?"}
        eqPieces={equations.Derivative}
        options={[
          'The weights of both clusters', 
          'The means and variances of each cluster', 
          'The means, variances, and weights of each cluster'
        ]}
        expandedOptions={[
          'Incorrect. The exponential parts of each function will affect the derivative.', 
          'Incorrect. The weights will be included in the derivative.',
          'Correct. Every term from the original expression will be a part of our derivative we must solve.'
        ]}
        correctness={[false, false, true]}
      />

      <div className='explanation'>
        <p>
          In the case of directly optimizing Gaussian mixture models our log likelihood expression yields a summation dependent on every parameter within a logarithm. A 
          summation inside of a log is not as easily separable as a product. Our optimization then leads to not only a system of nonlinear equations, but also 
          has no closed form solution.&nbsp;<a href='#bishop'>[1]</a> This means we cannot build the best density estimator as some operation of our data set, nor can we know the best Gaussian mixture that 
          predicts the probability of seeing a mountain lion over our whole map. This motivates the use of an algorithm that can optimize our distribution parameters instead of 
          one mathematical expression.
        </p>
      </div>

      <h3 id='EM'>The Expectation Maximization Algorithm</h3>
      <div className='explanation'>
        <p>
          We have shown why it is impossible to directly optimize Gaussian Mixtures with <a href='#MLE'>MLE</a>, however, we can use the Expectation Maximization (EM) algorithm to 
          solve this problem. The EM algorithm in general is a form of coordinate descent, meaning that we update some of a problem's parameters, but we hold others constant. 
          In general, the EM algorithm holds parameters for a target distribution constant, when trying to learn another latent variable, then vice 
          versa. The EM algorithm is guaranteed to reach a local solution after repeatedly taking turns optimizing the latent variables and other parameters.
        </p>
      </div>
      <div className='explanation'>
        In order to take advantage of the Expectation Maximization algorithm, we must introduce our latent variable. Suppose we have a Gaussian mixture with 3 individual 
        Gaussians as the density estimator of the likelihood of seeing mountain lion at each point on the map. Our latent variable will be the likelihood that each individual sighting
        was created by an individual distribution. For example one particular sighting can have a 20% likelihood of coming from the first individual normal distribution, 30% for the
        second, and 50% for the third. These probabilities will always add up to 100%.
      </div>
      <div id='softAssignment' className='explanation'>
        <p>
          More formally this latent variable is called the <strong>soft assignment</strong>. The expression below represents the soft assignment asosciated with each data point, x.
        </p>
      </div>
      <Expression pieces={equations.SoftAssignments}/>
      <div className='explanation'>
        To fit the EM algorithm to the problem of optimizing Gaussian Mixtures, it is important to make the realization that given the initial distribution parameters of our
        guassian mixture model (the means, covariance matrices, and weights assosciated with each distribution), it is trivial to find the probability assignment for each data point. Each index of our probability assignment is the value of the corresponding individual
        distribution divided by the total of all the distributions. This is known as the expectation step.
      </div>
      <Question 
        question={'Of all our distribution parameters and latent variables including the means, covariance matrices, weights and soft assignments, what is updated during the expectation step?'}
        options={[
          'The means, covariance matrices, and soft assignments of each point', 
          'The weights and the soft assignments of each point', 
          'The soft assignments of each point'
        ]}
        expandedOptions={[
          'Incorrect. The means and covariance matrices are distribution parameters, which are not updated in the expectation step', 
          'Incorrect. The weights are assosciated with our distribution parameters, which are not updated in the expectation step',
          'Correct. The soft assignments of each point correspond to our latent variable, which is updated in the expectation step'
        ]}
        correctness={[false, false, true]}
      />

      <div className='explanation'>
        We must also make the realization that it is trivial to calculate an update of our guassian mixtures' distribution parameters given our probability assignments. This is called the maximization step. The weight assosciated
        with a single distribution can be calculated as the mean probability assignment for that point. The mean for a single distribution can be calculated by taking a weighted average of
        our sighting positions in relation to the probability assignment for that specific distribution at each point. The covariance matrix can be calculated in much the same way, as a weighted
        sum of the difference between each sighting position and the single distributions mean, in relation to the probability assignment of that point. More formally, our distribution parameters
        are updated according to the formulas below:
      </div>

      <Expression pieces={equations.meanUpdate}/>
      <Expression pieces={equations.covUpdate}/>
      <Expression pieces={equations.weightUpdate}/>
      
      <Question 
        question={'Of all our distribution parameters and latent variables including the means, covariance matrices, weights and soft assignments, what is updated during the maximization step?'}
        options={[
          'The means, covariance matrices, and weights', 
          'The means, covariance matrices, and the soft assignments of each point', 
          'The soft assignments of each point'
        ]}
        expandedOptions={[
          'Correct, the means, covariance matrices, and weights correspond to the distribution parameters, which are updated in the maximization step', 
          'Incorrect. The soft assignments are only updated in the expectation step',
          'Incorrect. The soft assignments are only updated in the expectation step'
        ]}
        correctness={[true, false, false]}
      />
      
      <div className='explanation'>
        <p>
          As aforementioned, this process can continue until a local solution is achieved. A local solution does not guarantee a great 
          solution and it is therefore important to run the EM algorithm with many different initial distribution parameters. Different initializations for Gaussian Mixtures will be discussed later 
          in this article.&nbsp;<a href='#bishop'>1]</a>
        </p>
      </div>
      <div className='explanation'>
        Experiment with the below visualization of the EM algorithm to ensure you understand. Be sure to step forward, backward, and reinitialize the visualization to
        see the effect of different initializations and data sets.
      </div>

      <Screen scene={"emVisualization"}/>    

      <h3>Solving for the Best Path</h3>

      <div className='explanation'>
        We now understand everything required to find the path where we are least likely to find mountain lions. To do so we can use the following
        process.
      </div>
      <div className='explanation'>
        <ol>
          <li>Use the <a href='#EM'>EM algorithm</a> to learn a <a href='#densityEstimator'>density estimator</a> of our data set (positions of mountain lion sightings).</li>
          <li>Run the EM algorithm with multiple initializations to ensure we have a density estimator that is representative of our dataset.</li>
          <li>Approximate the <a href='#lineIntegral'>line integral</a> along each path using Reimann sums. This is our likelihood of seeing a mountain lion on this path.</li>
          <li>Compare the likelihood of seeing a mountain lion on each path.</li>
        </ol>
      </div>

      <Question 
        question={'The following is a visualization of the line integrals over a probability density estimator of a mountain lion sighting. Which path minimizes the probability of seeing a mountain lion?'}
        visual={'choosePath'}
        options={['The blue path', 'The orange path', 'The pink path']}
        expandedOptions={[
          'Incorrect. If we add the area of each individual trapeziod that makes up this line integral, we get an area of about 0.226. This is the largest area of all of the line integrals shown.', 
          'Correct. If we add the area of each individual trapezoid that makes up this line integral, we get an area of about 0.144. This is the smallest of the line integrals shown.', 
          'Incorrect. If we add the area of each individual trapeziod that makes up this line integral, we get an area of about 0.201. One of the line integrals here has a smaller area.']}
        correctness={[false, true, false]}
      />
      
      <h2>Further Study</h2>

      <h3>Gaussian Mixture Models as a Clustering Algorithm</h3>

      <div className='explanation'>
        <p>
          In our problem, we used Gaussian mixture models as a density estimator. However, our <a href='#softAssignment'>soft assignment</a> latent variable in the EM algorithm also reflects the partial
          assignments of each data point to an individual distribution. That is the probability for each point that it came from a particular cluster. These
          can be turned into hard assignments by choosing the index of the highest probability for each data point. This can be useful as not all clustering
          algorithms take covariance into account when segmenting data. For example, K-means is one such algorithm that does not take covariance into account when clustering data.
        </p>
      </div>

      <Question
        question={'Which clustering was likely generated by K-means?'}
        visual={'kmeans'}
        options={['Left', 'Right']}
        expandedOptions={['Correct. As K-means is not robust to covariance and breaks down at the edges of these distributions','Incorrect. K-means is not robust to covariance and would struggle to exactly label these distributions at the edges']}
        correctness={[true, false]}
      />
      
      <h3>Singularities</h3>

      <div className='explanation'>
        Without safegaurding, it is possible a Gaussian mixture can contain a singularity. This is where one of the normal distributions begins to center around one datapoint and
        the covariance matrix entries approach infinitely small values. Even if this may increase the likelihood expression of the data of a data set with outliers, it is likely not
        representative of the data to choose one distribution to center around one outlier. To mitigate this, you can ensure the diagonal entries of each covariance matrix have some
        minimum value they will not decrease beyond in the maximization step.
      </div>

      <h3>Initialization Strategies</h3>

      <div className='explanation'>
        Different initialization choices can have great effect on the result of a Gaussian mixture as the EM algorithm is only guaranteed to find a local solution. The covariance
        and weight for each normal distribution can be initialized as the identity matrix and equal weighting, or a similar psuedorandom value. For mean initializations, it is possible
        to choose random points within the bounds of the data set or random points in the data set. It is also possible to choose an existing point, weight the likelihood of choosing
        each successive point by which points have already been chosen (further points being more likely), and continue this cycle until all means are initialized. This method
        of means generation will likely generate better results than others, as they means are unlikely to be initialized near each other.
      </div>

      <h2>Acknowledgements</h2>

      <h3>Works Cited</h3>

      <div className='explanation' id='bishop'>
        <p>
          <strong>[1]</strong> C. M. Bishop, Pattern recognition and machine learning. Springer, 2016.
        </p>
      </div>

      <h3>Authorship</h3>

      <div className='explanation'>
        A site by Stuart Allen, in partial fulfillment of the requirements for the degree of Honors Baccalaureate of Science in Computer Science (Honors Scholar).
      </div>

      <div className='explanation'>©Copyright by Stuart Allen</div>

      <div id="endSpacer"></div>

    </div>
  );
}

export default App;