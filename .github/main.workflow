workflow "packtracker.io" {
  on = "push"
  resolves = ["report webpack stats"]
}

action "report webpack stats" {
  uses = "packtracker/report@2.2.0"
  secrets = ["ee605b70-f381-462e-8c9b-1e88ef52dab3"]
}