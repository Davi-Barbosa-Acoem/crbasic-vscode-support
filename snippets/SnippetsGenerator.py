Params = []
with open("snippets\Commands.txt", "r") as file:
    for l in file:
        Params.append(l.replace("\n",""))
print(Params)

SnippetName = input("SnipetName: ")
res = []
i = 1
for w in Params:
    res.append("${" + f"{i}:{w}" + "}")
    i +=1
res = "".join(res)
print(f"\"{SnippetName}\" :" ,"{",f"\n\t\"prefix\" : "f"\"{SnippetName.lower().replace("_","")}\",\n\t\"body\" : [\n\t\t\"{SnippetName} ({res})\"\n\t]\n"+"}")