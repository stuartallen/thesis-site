export default function gaussian(x, y, a, b, c, d) {
    const covarianceMatrix = new Array(2);

    covarianceMatrix[0] = new Array(2);
    covarianceMatrix[1] = new Array(2);
    
    covarianceMatrix[0][0] = a;
    covarianceMatrix[0][1] = b;
    covarianceMatrix[1][0] = c;
    covarianceMatrix[1][1] = d;
    
    const determinant = covarianceMatrix[0][0] * covarianceMatrix[1][1] - covarianceMatrix[0][1] * covarianceMatrix[1][0]
    
    const inverseCovarianceMatrix = new Array(2);
    
    inverseCovarianceMatrix[0] = new Array(2);
    inverseCovarianceMatrix[1] = new Array(2);
    
    inverseCovarianceMatrix[0][0] = (1 / determinant) * covarianceMatrix[1][1];
    inverseCovarianceMatrix[0][1] = (1 / determinant) * -covarianceMatrix[0][1];
    inverseCovarianceMatrix[1][0] = (1 / determinant) * -covarianceMatrix[1][0];
    inverseCovarianceMatrix[1][1] = (1 / determinant) * covarianceMatrix[0][0];
    
    const invCov = new Array(4)
    invCov[0] = inverseCovarianceMatrix[0][0]
    invCov[1] = inverseCovarianceMatrix[0][1]
    invCov[2] = inverseCovarianceMatrix[1][0]
    invCov[3] = inverseCovarianceMatrix[1][1]
    
    const mean = new Array(2);
    mean[0] = x
    mean[1] = y

    return [mean, determinant, invCov, [a, b, c, d]]
}