provider "aws" {
  region = var.region
}

data "aws_caller_identity" "current" {}

terraform {
  backend "s3" {}
  required_version = ">= 0.12"
}

locals {
  hosted_zone_name  = join(".", slice(split(".", local.site_domain), 1, length(split(".", local.site_domain))))
  site_domain       = var.SITE_DOMAIN
  cloufront_domains = [local.site_domain]
  account_id        = data.aws_caller_identity.current.account_id
  tags = {
    Namespace = var.APP_NAMESPACE
  }
}
