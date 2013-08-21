//basePath = '../';
//
//files = [
//  ANGULAR_SCENARIO,
//  ANGULAR_SCENARIO_ADAPTER,
//  'test/e2e/**/*.js'
//];
//
//autoWatch = false;
//
//browsers = ['Chrome'];
//
//singleRun = true;
//
//proxies = {
//  '/': 'http://localhost:8000/'
//};
//
//junitReporter = {
//  outputFile: 'test_out/e2e.xml',
//  suite: 'e2e'
//};

module.exports = function (config) {
	config.set({
		basePath: '../',
		frameworks: ["jasmine"],
		files: [
			'test/e2e/**/*.js'
		],
		autoWatch: true,
		browsers: ['Chrome'],
		singleRun: true,
		proxies: {
			'/': 'http://localhost:8000/'
		},
		junitReporter: {
			outputFile: 'test_out/e2e.xml',
			suite: 'e2e'
		}
	});
};
