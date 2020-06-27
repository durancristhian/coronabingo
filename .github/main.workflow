workflow "packtracker.io" {
  on = "push"
  resolves = ["report webpack stats"]
}

action "report webpack stats" {
  uses = "packtracker/report@2.2.0"
  secrets = [${{ secrets.PACKTRACKER_PROJECT_ID }}]
}