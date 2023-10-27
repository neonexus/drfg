const chai = require('chai');
const should = chai.should();
const fs = require('fs');
const path = require('path');
const utils = require('../src/utilities');

chai.use(require('chai-spies'));

describe('drfg - Download Release From Github', () => {
    afterEach((done) => {
        chai.spy.restore();
        done();
    });

    describe('Utility Functions', () => {
        it('should have color options', (done) => {
            utils.colors.should.be.an('object');
            Object.keys(utils.colors).should.have.lengthOf(5);

            should.exist(utils.colors.blue);
            should.exist(utils.colors.bold);
            should.exist(utils.colors.invert);
            should.exist(utils.colors.red);
            should.exist(utils.colors.reset);

            done();
        });

        it('should create blank lines in the console', (done) => {
            const og = console.log;
            console.log = () => {};
            const consoleLogSpy = chai.spy.on(console, 'log');

            utils.blankLine();

            consoleLogSpy.should.have.been.called.once.with('');

            console.log = og;
            done();
        });

        it('should fix time calculations', (done) => {
            const oneMilli = 1000000; // 1 million nanoseconds in 1 millisecond

            const milliseconds = utils.fixTime([0, oneMilli * 3]);
            milliseconds.should.eq('3.00 ms');

            const seconds = utils.fixTime([2, oneMilli * 750]);
            seconds.should.eq('2.75 s');

            const minutes = utils.fixTime([240, oneMilli * 12000]);
            minutes.should.eq('4.20 m');

            done();
        });

        it('should format bytes', (done) => {
            const zeroBytes = utils.formatBytes(0);
            zeroBytes.should.eq('0 Bytes');

            const someBytes = utils.formatBytes(512);
            someBytes.should.eq('512 Bytes');

            const kilobytes = utils.formatBytes(2048);
            kilobytes.should.eq('2.00 KiB');

            const megabytes = utils.formatBytes(44480594);
            megabytes.should.eq('42.42 MiB');

            const gigabytes = utils.formatBytes(3382300000);
            gigabytes.should.eq('3.15 GiB');

            const terabytes = utils.formatBytes(76328100000000);
            terabytes.should.eq('69.42 TiB');

            done();
        });

        it('should calculate the size of a directory recursively', (done) => {
            const githubSize = fs.statSync(path.join(__dirname, '../.github/FUNDING.yml')).size + fs.statSync(path.join(__dirname, '../.github/workflows/codeql-analysis.yml')).size;

            const utilsCalc = utils.getDirectorySize(path.join(__dirname, '../.github'));

            utilsCalc.should.be.eq(githubSize);

            done();
        });

        it('should be able to ask the user questions in the console', (done) => {
            const readlineInterface = chai.spy.interface({
                question: chai.spy((q, a) => {
                    q.should.eq('Test: ');
                    a('neat');
                }),
                close: chai.spy()
            });

            const answerSpy = chai.spy();

            utils.question(
                'Test',
                answerSpy,
                {
                    createInterface: (input) => {
                        input.should.have.property('input', process.stdin);
                        input.should.have.property('output', process.stdout);

                        return readlineInterface;
                    }
                }
            );

            answerSpy.should.have.been.called.once.with('neat');
            readlineInterface.question.should.have.been.called.once;
            readlineInterface.close.should.have.been.called.once;

            done();
        });

        it('should create star boxes', (done) => {
            const og = console.log;
            console.log = () => {};
            const consoleLogSpy = chai.spy.on(console, 'log');

            utils.starBox('Nice Test!');
            consoleLogSpy.should.on.nth(1).to.have.been.called.with('****************\n*              *\n*  Nice Test!  *\n*              *\n****************');

            utils.starBox('Multiple\nlines\ntest');
            consoleLogSpy.should.on.nth(2).to.have.been.called.with('**************\n*            *\n*  Multiple  *\n*   lines    *\n*    test    *\n*            *\n**************');

            utils.starBox('Left test\n          Neat', true);
            consoleLogSpy.should.on.nth(3).to.have.been.called.with(
                '********************\n*                  *\n*  Left test       *\n*            Neat  *\n*                  *\n********************'
            );

            utils.starBox('Small test', false, true);
            consoleLogSpy.should.on.nth(4).to.have.been.called.with('****************\n*  Small test  *\n****************');

            utils.starBox('Padding test', false, false, 5);
            consoleLogSpy.should.on.nth(5).to.have.been.called.with(
                '************************\n*                      *\n*     Padding test     *\n*                      *\n************************'
            );

            console.log = og;
            done();
        });
    });
});
