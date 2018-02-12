describe('API Routes', () => {
  describe('POST /upload', () => {
    it('Prevent upload of a non image file', (done) => {
      request.post('/api/upload').send('').attach('image', 'tests/test_assets/bad.png')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) done(err);
          res.body.should.have.property('status', 400);
          done();
        });
    });

    it('Upload of a .PNG file', (done) => {
      request.post('/api/upload').send('').attach('image', 'tests/test_assets/good.png')
        .expect(200)
        .end((err, res) => {
          done(err);
        });
    });
  });
});
