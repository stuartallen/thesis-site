import './App.css';
import EMVWrapper from './components/EMVWrapper';
import Question from './components/Question';

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
      <h1>An Introduction to Gaussian Mixture Models</h1>
      {/* <EMVWrapper /> */}
      <h3>Our example problem, Avoiding Mountain Lions</h3>
      <div className='explanation'>
        Suppose we are beginning a hike through a region known for its mountain lions. At the beginning of our trek, we have access to a map
        with our trails, as well as the coordinates of every recent mountain lion sighting. Our goal is to choose the trail where we are least
        likely to find a mountain lion.
      </div>
      <img className='outerImg' src='firstExample.png' alt='An Image of Two Hiking Paths with Cougar Siting' />
      <div className='explanation'>
        How might we approach this problem? In some cases it may be trivial if sightings are clearly localized around a certain path. However,
        this will not always be the case. For example, suppose one path is much longer than another, and the shorter path goes directly through
        a cluster of sightings. While it's best to avoid going directly through a cluster of sightings, a longer path presents more opportunities
        to meet these creatures as well. How can we make a decision about which path to choose in these less than obvious situations?
      </div>
      <img className='outerImg' src='inconclusive1.png' alt='Another Image of Two Hiking Paths with Cougar Siting' />
      <div className='explanation'>
        What if we could approximate the relative likelihood of seeing a mountain lion at any point on our map? With that information we could take the sum of these
        relative likelihoods at each point along a path. This would give us a total probability of seeing a mountain lion for a certain path. Then we could
        simply compare these total probabilities for each path to see which one is best!
      </div>
      <div className='explanation'>
        But how is it possible to transform a set of sightings into a probability of seeing a mountain lion at any point in our map? This can be
        accomplished with Gaussian Mixture Models.
      </div>

      <h3>Understanding Gaussian Mixtures</h3>
      <div className='explanation'>
        Gaussian distributions are also known as normal distributions, as well as Bell curves. This kind of distribution has two important parameters:
        mean and variance. The mean of a distribution describes the point at where the highest values of the function are centered around, the variance
        describes how spread out the values of the function are. Use the below graphing editor to experiment with the parameters.
      </div>
      <iframe src="https://www.desmos.com/calculator/nex629j6ff" width="500" height="500" ></iframe>
      <div className='explanation'>
        You have likely seen this kind of distribution before, however, you may not have seen a multivariate gaussian distribution. A multivariate gaussian
        distribution has many similarities to its one dimensional counterpart. It has a mean where most of the highest values of the function are centered
        around, as well as a covariance matrix that describes how spread the values of the function are.
      </div>
      <Screen scene={"singleGaussian"}/>
      <div className='explanation'>
        Mutlidimensional gaussian distributions also have covariance properties. This means the spread of the function may be mostly circular, coincide with
        an axis, or diagonal. The flexibility of multivariate gaussian distribution's mean and covariance parameters makes them useful to our problem. For example, the sightings
        of one particular mountain lion on a map may well follow a distribution like this.
      </div>
      <Screen scene={"singleGaussianDiagonal"}/>
      <div className='explanation'>
        If the sightings of one mountain lion follow a multivariate gaussian distribution, perhaps a mixture of these distributions can describe the
        sighting activity of several. A mixture of gaussians can be made from a weighted sum of two or more distributions. Applying a weight to each
        individual sum is necessary as the sum of all values in a probability distribution must add to 100%. However, this is more of an advantage as it
        lets our mixed distribution have even more flexibility to represent data. Observe a gaussian mixture in the one dimensional case:
      </div>
      <iframe src="https://www.desmos.com/calculator/92jdxkbomr" width="500" height="500" ></iframe>
      <div className='explanation'>
        As well as a multivariate gaussian mixture:
      </div>
      <Screen scene={"normalMix"}/>

      <div className='explanation'>
        Univaraite and multivariate, mixture and single gaussian distributions can also be called density estimators. Meaning they describe the density
        of the probability around some input. It is more common to call multivariate gaussian mixtures density estimators as they are far more flexible
        than the other aforementioned distributions. We will use multivariate gaussian mixtures to find a good density estimator of the likelihood of seeing
        a mountain lion at each point on the map.
      </div>

      <h3>Check your Understanding</h3>
      <div className='explanation'>
        The following questions contain visualizations of normal distributions and data in a plane. Given what you've just learned about gaussian
        mixtures, answer the following questions:
      </div>

      <Question 
        question={'Which density estimator better represents this data'}
        visual={'covarianceDemo'}
        options={['Left','Right']}
        expandedOptions={['Correct. This option allows for non-circular distributions in the density estimator', 'Incorrect. The left cluster of the density estimator has the same covariance as the right, which is not reflected in the dataset']}
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

      <h3>Finding The Probability Of A Sighting Along A Path, Line Integrals Along A Gaussain Mixture</h3>
      <div className='explanation'>
        Now that we understand the kind of distribution our mountain lions sightings would follow, we can now find the probability of seeing a mountain
        lion on our observed path. We deduced earlier that if we take the sum of all the probabilities along one path, we would know the total probability
        of seeing a mountain lion along that path. This can be accomplished by what is called a line integral. A line integral more generally is the sum of 
        all the points under a multidimensional function along a line. Our multidimensional function is our multivariate gaussian mixture. This kind of 
        distribution is difficult to calculate an exact line integral over. However, we can construct an approximation by splitting our line and the area 
        underneath into trapezoids. This more generally known as a Reimann sum approximation. Below is a visualization of the an approximate line integral
        over a gaussian mixture:
      </div>
      <Screen scene={"lineIntegral"}/>

      <div className='explanation'>
        Now we know what kind of distribution can approximate the likelihood of seeing a mountain lion on our map, as well as use that information to 
        find the probability of seeing a mountain lion on a certain path. All we need to know now is how to learn what multivariate gaussian distribution
        fits the sightings on our map best.
      </div>

      <h3>The Derivative Log Problem, Why Gaussian Mixtures Cannot Be Learned Directly</h3>

      <div className='explanation'>
        As we are only given the location of mountain lion sightings, we must find a gaussian mixture that best represents this data in order to
        build our density estimator. A typical method of learning the parameters of our gaussian mixture is Maximum likelihood Estimation
        (MLE). Many machine learning problems can be solved through directly maximizing the log-likelihood expression. If our data is independent, meaning one mountain lion sighting does not influence another, the likelihood function of our
        data is a product of the likelihood of each data point given our distribution parameters: the mean and covariance. The log-likelihood is a useful expression as it is a 
        monotonic function and therefore retains the same local and global maximums and minimums. Additionally, the log likelihood of a product usually reduces 
        to a sum which leads to a drastically simpler expression when applying the derivative operator with respect to one of a model’s parameters. In 
        many cases such as linear regression, a closed form solution is possible. Answer the following question to observe why this is not the case for optimizing gaussian mixture models.
      </div>

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

      <div className='explanation'>
        In the case of directly optimizing gaussian mixture models our log-likelihood function yields a summation dependent on every parameter within a logarithm. A 
        summation inside of a log is not as easily separable as a product. Our optimization then leads to not only a system of nonlinear equations, but also 
        has no closed form solution. This means we cannot build the best density estimator as some operation of our dataset nor can we know the best gaussian mixture that 
        predicts the probability of seeing a mountain lion over our whole map. This drives us to use a method of coordinate descent called the Expectation Maximization algorithm.
      </div>

      <h3>The Expectation Maximization Algorithm</h3>
      <div className='explanation'>
        We have shown why it is impossible to directly optimize Gaussian Mixtures with MLE, however, we can use the Expectation Maximization (EM) algorithm to 
        solve this problem. The EM algorithm in general is a form of coordinate descent, meaning that we update some of a problem's parameters, but we hold others constant. 
        In general, expectation maximization holds parameters for a target distribution constant, when trying to learn another latent variable, then vice 
        versa. The EM algorithm is guaranteed to reach a local solution after repeatedly taking turns optimizing the latent variables and other parameters.
      </div>
      <div className='explanation'>
        In order to take advantage of the Expectation Maximization algorithm, we must introduce our latent variable. Suppose we have a gaussian mixture with 3 individual 
        gaussians as the density estimator of the likelihood of seeing mountain lion at each point on the map. Our latent variable will be the likelihood that each individual sighting
        was created by an individual distribution. For example one particular sighting can have a 20% likelihood of coming from the first individual normal distribution, 30% for the
        second, and 50% for the third. These probabilities will always add up to 100%.
      </div>
      <div className='explanation'>
        To fit the EM algorithm to the problem of optimizing Gaussian Mixtures, it is important to make the realization that given the initial distribution parameters of our
        guassian mixture, it is trivial to find the probability assignment for each data point. Each index of our probability assignment is the value of the corresponding individual
        distribution divided by the total of all the distributions. This is known as the expectation step.
      </div>
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

      <div className='explanation'>
        We must also make the realization that it is trivial to calculate an update of our guassian mixtures' distribution parameters given our probability assignments. The weight assosciated
        with a single distribution can be calculated as the mean probability assignment for that point. The mean for a single distribution can be calculated by taking a weighted average of
        our sighting positions in relation to the probability assignment for that specific distribution at each point. The covariance matrix can be calculated in much the same way, as a weighted
        sum of the difference between each sighting position and the single distributions mean, in relation to the probability assignment of that point.
      </div>
      
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
      
      <div className='explanation'>As aforementioned, this process can continue until a local solution is achieved. A local solution does not guarantee a great 
        solution and it is therefore worth running the algorithm with different initializations. Different initializations for Gaussian Mixtures will be discussed later 
        in this article.
      </div>
      <div className='explanation'>
        Experiment with this visualization of the EM algorithm to ensure you understand:
      </div>

      <Screen scene={"emVisualization"}/>    

      <h3>Solving for the Best Path</h3>

      <div className='explanation'>
        We now understand everything required to find the path where we are least likely to find mountain lions. To do so we can use the following
        process.
      </div>
      <div className='explanation'>
        <ol>
          <li>Use the EM algorithm to learn a density estimator of our data.</li>
          <li>Use multiple initializations to ensure we use a great density estimator.</li>
          <li>Approximate the integral along each path using Reimann sums or similar estimation method.</li>
          <li>Compare the likelihood of seeing a mountain lion on each path.</li>
        </ol>
      </div>

      <Question 
        question={'The following is a visualization of the line integrals over a probability density estimator of a mountain lion sighting. Which path minimizes the probability of seeing a mountain lion?'}
        visual={'choosePath'}
        options={['The green path', 'The red path', 'The blue path']}
        expandedOptions={[
          'Incorrect. If we add the area of each individual trapeziod that makes up this line integral, we get an area of about 0.226. This is the largest area of all of the line integrals shown.', 
          'Correct. If we add the area of each individual trapezoid that makes up this line integral, we get an area of about 0.144. This is the smallest of the line integrals shown.', 
          'Incorrect. If we add the area of each individual trapeziod that makes up this line integral, we get an area of about 0.201. One of the line integrals here has a smaller area.']}
        correctness={[false, true, false]}
      />
      
      <h2>Further Study</h2>

      <h3>Gaussian Mixture Models as a Clustering Algorithm</h3>

      <div className='explanation'>
        In our problem, we used gaussian mixture models as a density estimator. However, our latent variable in the EM algorithm reflects the partial
        assignments of each data point. That is the probability for each point that it came from a particular cluster. These are called soft assignments, but these
        can be turned into hard assignments by choosing the index of the highest probability for each data point. This can be useful as not all clustering
        algorithms take covariance into account when segmenting data. For example, K-means is one such algorithm that does not build a density estimator nor
        take covariance into account when optimizing its clusters.
      </div>

      <Question
        question={'Which clustering was likely generated by K-means?'}
        visual={'kmeans'}
        options={['left', 'right']}
        expandedOptions={['Correct. As K-means is not robust to covariance and breaks down at the edges of these distributions','Incorrect. K-means is not robust to covariance and would struggle to exactly label these distributions at the edges']}
        correctness={[true, false]}
      />

      <h3>Evaluating the Fit of a Gaussian Mixture</h3>

      <div className='explanation'>
        The fit of a gaussian mixture can be measured in many ways, but a popular choice is the likelihood expression as mentioned earlier. Holding the number of clusters
        constant a mixture with a higher likelihood than another is usually a better representation of the data. However, as the number of individual normal distributions
        within the mixture increases the likelihood will generally increase until the number of distributions reaches the number of datapoints. This is because each distribution
        can be responsible for less of the data until it only represents one data point. In this manner if we optimize with respect to number of clusters, we learn nothing about
        the distribution underlying the data. Instead, there is typically a point where increasing the number of clusters presents diminishing returns for the likelihood. Choosing 
        this 'corner' value typically yields a reasonable number of clusters to represent the data.
      </div>
      
      <h3>Singularities</h3>

      <div className='explanation'>
        Without safegaurding, it is possible a gaussian mixture can contain a singularity. This is where one of the normal distributions begins to center around one datapoint and
        the covariance approaches an infinitely small value. Even if this may increase the likelihood expression of the data of a dataset with outliers, it is likely not
        representative of the data to choose one distribution to center around one outlier. To mitigate this, a minimum covariance matrix for each distribution can be set during the
        maximization step.
      </div>

      <h3>Initialization Strategies</h3>

      <div className='explanation'>
        Different initialization choice can have great effect on the result of a gaussian mixture as the EM algorithm is only guaranteed to find a local solution. The covariance
        and weight for each normal distribution can be initialized as the identity matrix and equal weighting, or a similar psuedorandom value. For mean initializations, it is possible
        to choose random points within the bounds of the dataset or random points in the dataset. It is also possible to choose an existing point, weight the likelihood of choosing
        each successive point by which points have already been chosen (further points being more likely), and continue this cycle until all means are initialized.
      </div>

    </div>
  );
}

export default App;