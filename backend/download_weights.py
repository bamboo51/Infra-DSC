import os

from huggingface_hub import hf_hub_download

HF_REPO = os.getenv("HF_WEIGHTS_REPO", "Phongwit/YOLO_RDD2022")
WEIGHTS_DIR = os.path.join(os.path.dirname(__file__), "weights")

WEIGHTS = {
    "detect.pt": "detect.pt",
    "segment.pt": "segment.pt",
}


def ensure_weights() -> dict[str, str]:
    """
    Download weights if missing;
    return {local_name: absolute_path}
    """
    os.makedirs(WEIGHTS_DIR, exist_ok=True)
    paths = {}
    for local_name, repo_name in WEIGHTS.items():
        target = os.path.join(WEIGHTS_DIR, local_name)
        if not os.path.exists(target):
            download = hf_hub_download(
                repo_id=HF_REPO, filename=repo_name, local_dir=WEIGHTS_DIR
            )
            print(f"Downloaded {repo_name} to {download}")
        paths[local_name] = target
    return paths


if __name__ == "__main__":
    for name, path in ensure_weights().items():
        print(f"{name} -> {path}")
