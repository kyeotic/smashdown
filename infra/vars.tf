variable "region" {
  default = "us-west-2"
}

variable "cloudflare_account_name" {
  default = "tim@kye.dev"
}

variable "cloudflare_api_token" {
  sensitive = true
}

variable "domain_name" {
  default = "smash.kye.dev"
}

variable "zone_name" {
  default = "kye.dev"
}
