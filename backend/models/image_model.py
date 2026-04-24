import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image

# Load pretrained model
model = models.resnet18(pretrained=True)
model = torch.nn.Sequential(*list(model.children())[:-1])
model.eval()

# Transform image
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

def get_image_embedding(image_path):
    image = Image.open(image_path).convert("RGB")
    image = transform(image).unsqueeze(0)

    with torch.no_grad():
        embedding = model(image)

    return embedding.flatten().numpy()