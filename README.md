Let's start our tour of the darkend mansion...
Using a flashlight...
Or a candle. Perhaps that's more fitting.....

# Creating a basic .NET core web api  

#### Prereqs
1. VS Code
2. `.NET core` SDK

#### Create a new console project 
1. Create a new folder and `cd` into it
2. Create a new console project called `Meshd` with `dotnet new console -n Meshd`
3. `cd` into the `Meshd` directory (to where the `.csproj` file is) and run `dotnet run`

#### Turn the console project into a web api 
1. Create a `Startup.cs` file next to `Program.cs`
2. Add the following code snippet:
```
namespace <insert application name>
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.Run(async (context) =>
            {
                await context.Response.WriteAsync("Hello World!");
            });
        }
    }
}
```
3. If there are red lines indicating errors, ignore them for now; we'll come back to these
4. Add the following code into the `Program.cs` file (you can leave the initial `Hello World` there if you'd like:
```
namespace <insert application name>
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>();
    }
}
```
4. Run the project using `dotnet run`. It will fail with a number of `CS0246` errors

#### Make developing a lot easier by installing Omnisharp 
1. Install `C# by OmniSharp`
2. Restart VS Code if necessary 

#### Add the package needed to make the new code build & run 
1. Add the required package to the project by running `dotnet add package Microsoft.AspNetCore.App`. This will add 
```
  <ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.App" Version="2.1.4" />
  </ItemGroup>
```
to the `.csproj` file. A pop up will warn of unresolved dependaicnes. Click `yes` to install the required dependancies. (Previously `Microsoft.AspNetCore.All` was used; this is larger than necessary.)
1. Now when you resolve the build errors in `Startup.cs` and `Program.cs` (by clicking on the lightbulbs on the lines that have red underlining) you'll be able to add the `using` statements that you need 
2. Run the project with `dotnet run`. Congratuations, you now have an api. Head to `localhost:5000` and make sure you see `Hello World!`.

#### _Optional: Create a `.sln` file_ 
Sometimes Omnisharp can want a `'sln` file before it will start providing intellisense. If you're having trouble, try creating a `.sln` file and adding the current project, using the steps here.

1. `cd` into the root directory
2. Create the new `.sln` file with `dotnet new sln -n Meshd`
3. Add the project to the solution with `dotnet sln Meshd.sln add Meshd/Meshd.csproj`

#### Create a web api 
1. Add the following snippet to `Startup.cs`:
```
public void ConfigureServices(IServiceCollection services){
    services.AddMvc();
}

public void Configure(IApplicationBuilder app)
{
    app.UseMvc();

    app.Run(context =>
    {
        return context.Response.WriteAsync("Hello world");
    });

}
```

2. `app.UseMvc()` tells your app to add MVC to the request execution pipeline
3. Add `<Project Sdk="Microsoft.NET.Sdk.Web">` to the top of the `.csproj` file (the origional entry will be `<Project Sdk="Microsoft.NET.Sdk">`). This will ensure that the controllers are registered.
4. Create a `Controllers` folder
5. In the `Controllers` folder create a `ValuesController.cs` file and insert the following snippet:
```
namespace <application name>.Controllers
{
    [Route("api/[controller]")]
    public class ValuesController : Controller
    {
        // GET api/values
        [HttpGet]
        public string Get()
        {
            return "Hello from the controller";
        }
    }
}
```
6. Add in the necessary `using` statements as required 
7. Run `dotnet run`
8. Navigate to `localhost:5000/api/values` and you should see `Hello from the controller`

#### Serve static files 
1. Create a `wwwroot` folder in the root directory 
2. Create an `index.html` file with the following snippet:
```
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title></title>
</head>
<body>
    <h1>Welcome to the index file</h1>
</body>
</html>
```
3. Add the following snippet to `Startup.cs` to tell the app to serve static files:
```
// Serve the files Default.htm, default.html, Index.htm, Index.html
// by default (in this order)
app.UseDefaultFiles();
// Serves all static files in wwwroot
app.UseStaticFiles();
```
4. At this point you can remove the `app.Run` block:
```
app.Run(async (context) =>
{
    await context.Response.WriteAsync("Hello World!");
});
```

#### Watching files for changes 
It's a pain to make changes, stop the app, then rerun `dotnet run`. Stop the app and run `dotnet watch run`. Head to `Program.cs` and remove `Console.WriteLine("Hello World!");`. The app should rebuild and rerun. 

#### Adding Javascript 
1. Create a `js` folder in `wwwroot`
2. Create an `index.js` file and paste in the following code:
```
let count = 0;

function callController() {
    const root = document.getElementById('root');

    const request = new XMLHttpRequest();
    request.open("GET", 'http://localhost:5000/api/values');
    request.send();
    request.onreadystatechange = (e) => {
        if (request.readyState == 4 && request.status == 200){
            if (request.responseText) {
                count++;

                const data = request.responseText;

                root.innerHTML = "";

                const container = document.createElement('div');
                root.appendChild(container);
                const p = document.createElement('p');
                p.textContent = `${data} called ${count} times`
                container.appendChild(p);
            }
        }
    }
}
```
3. In the `index.html` file, add in a a target div for the js to attach to: `<div id="root"></div>`
4. Add a button to call the js function: `<button type="button" onclick="callController();">Click to get values</button>`
5. Add the script to the page: `<script src="./js/index.js"></script>`
