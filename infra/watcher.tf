module "watcher" {
  source      = "github.com/kyeotic/tf-domain-heartbeat"
  lambda_name = "${replace(var.domain_name, ".", "-")}-watcher"
  watch_url   = var.domain_name
}
