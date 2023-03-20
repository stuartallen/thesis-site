import './App.css';
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
      <h3>Our example problem, Avoiding Mountain Lions</h3>
      <div className='explanation'>
        Suppose we are beginning a hike through a region known for its mountain lions. At the beginning of our trek, we have access to a map
        with our trails, as well as the coordinates of every recent mountain lion sighting. Our goal is to choose the trail where we are least
        likely to find a mountain lion.
      </div>
      <div className='explanation'>
        How might we approach this problem? In some cases it may be trivial if sightings are clearly localized around a certain path. However,
        this will not always be the case. For example, suppose one path is much longer than another, and the shorter path goes directly through
        a cluster of sightings. While its best to avoid going directly through a cluster of sightings, a longer path presents more opportunities
        to meet these creatures as well. How can we make a decision about which path to choose in these less than obvious situations?
      </div>
      <div className='explanation'>
        In order to find which path is safest, we must analyze the probability density of finding a mountain lion at all possible locations along a route.
        We can use the line integral over a probability density estimator of the region to find a probability of seeing a mountain lion on this route. It is simple to approximate this
        line integral by splitting each path into points evenly distributed across a route, computing the height of the gaussian mixture at each
        point, and finally finding the sum of all the areas of trapezoids from adjacent points. Below is an interactive visualization that shows how the area under a path for some density estimation function.
      </div>

      <Screen scene={"lineIntegral"}/>

      <h3>Gaussian Mixtures as Density Estimators</h3>
      <div className='explanation'>
        A gaussian mixture is the weighted sum of multiple gaussian distributions. Gaussian distributions are also known as normal distributions,
        as well as Bell curves. The important aspect for our purpose is for each distribution, the majority of the value is centered about some
        mean. Adding multiple gaussian distributions together creates a density function where the majority of the data is most likely to be 
        centered around multiple means. Each distribution must be weighted when combining to form a density estimator so the entire area under
        the density estimator sums to 1. Distributions can be weighted evenly, but we will allow for uneven weights to allow the density estimator
        to reflect that data may be more likely to come from one distribution over another.
      </div>
      <div className='explanation'>
        As our problem attempts to build a density estimator over a two dimensional field with two dimensional data, we require a two dimensional
        normal distribution. Multivariate normal distributions are similar to single dimensional normal distributions as values near the mean are
        most likely. The only difference is an input value is of two or more dimensions. Multivariate normal distributions
        can also account for covariance. While a one dimensional normal distribution can only control how thin it is with its variance, a multivariate
        normal distribution has a covariance given by a square matrix with as many rows and columns as there are dimensions in the space. In the two
        dimensional case this means a normal distribution can be circular, longer in one direction or another, or at some diagonal. A two dimensional 
        gaussian mixture can be constructed from two dimensional normal distributions in the same manner as the one dimensional case.
      </div>
      <div className='explanation'>
        Below is a visualization of a two dimensional gaussian mixture.
      </div>
      <Screen scene={"normalMix"}/>

      <div className='explanation'>
        The following questions contain visualizations of normal distributions and data in a plane. Given what you've just learned about gaussian
        mixtures, answer the following questions:
      </div>

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

      <h3>The Derivative Log Problem, Why Gaussian Mixtures Cannot Be Learned Directly</h3>

      <div className='explanation'>
        As we are only given the location of mountain lion sightings, we must find a gaussian mixture that best represents this data in order to
        build our density estimator. A typical method of learning the parameters of our gaussian mixture is Maximum likelihood Estimation
        (MLE). Many machine learning problems can be solved through direct maximizing the log-likelihood expression. If our data is independent, the likelihood function of our
        data is a product of the likelihood of each data point given our distribution parameters. The log-likelihood is a useful expression as it is a 
        monotonic function and therefore retains the same local and global maximums and minimums. Additionally, the log likelihood of a product usually reduces 
        to a sum which usually leads to a drastically simpler expression when applying the derivative operator with respect to one of a model’s parameters. In 
        many cases such as linear regression, a closed form solution is possible. Answer the following question to observe why this is not the case for us.
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
        In the case of directly optimizing gaussian mixture models our log-likelihood function yields a summation dependent on every parameter within a log. A 
        summation inside of a log is not as easily separable as a product. Our optimization then leads to not only a system of nonlinear equations, but also 
        has no closed form solution. This drives us to use a method of coordinate descent called the Expectation Maximization algorithm.
      </div>

      <h3>The Expectation Maximization Algorithm</h3>
      <div className='explanation'>
        We have shown why it is impossible to directly optimize Gaussian Mixtures with MLE, however, we can use the Expectation Maximization (EM) algorithm to 
        solve this problem. The EM algorithm is a form of coordinate descent, meaning that we update all our parameters, but we hold some constant when optimizing 
        others. In general, expectation maximization holds parameters for a target distribution constant, when trying to learn another latent variable, then vice 
        versa. The EM algorithm is guaranteed to reach a local solution after repeatedly taking turns optimizing the latent variables and distribution parameters.
      </div>
      <div className='explanation'>
        To fit the EM algorithm to the problem of optimizing Gaussian Mixtures, it is important to make the realization that the cluster assignments per data point 
        are trivial to calculate given the parameters of the different distributions and vice versa. This means with an initial set of parameters we can make an inference 
        of our latent variable: the partial assignment of each data. The partial assignments then allow us to create an update for each individual normal distribution's mean, 
        covariance, and partial assignment. As aforementioned, this process can continue until a local solution is achieved. A local solution does not guarantee a great 
        solution and it is therefore worth running the algorithm with different initializations. Different initializations for Gaussian Mixtures will be discussed later 
        in this article.
      </div>
      <div className='explanation'>
        Experiment with this visualization of the EM algorithm to ensure you understand:
      </div>

      <Screen scene={"emVisualization"}/>
      
      <div className='explanation'>
        Given this overview of the EM algorithm, answer the following questions about how it applies to our case specifically:
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