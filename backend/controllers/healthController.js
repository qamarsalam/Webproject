function getHealth(req, res) {
  res.status(200).json({
    status: "ok",
    service: "KUEvents API",
    timestamp: new Date().toISOString(),
  });
}

module.exports = {
  getHealth,
};
