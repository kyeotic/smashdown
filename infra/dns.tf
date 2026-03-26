data "cloudflare_zone" "domain" {
  name = var.zone_name
}

resource "cloudflare_workers_domain" "smashdown" {
  account_id                  = local.cloudflare_account_id
  hostname                    = var.domain_name
  service                     = "smashdown"
  zone_id                     = data.cloudflare_zone.domain.id
}
