# Prim's Minimum Spanning Tree Algorithm - Naive version
@nodes = [{:lat=>48.8491898, :lon=>2.3364501}, {:lat=>48.8719444, :lon=>2.3316667}, {:lat=>48.8546374434143, :lon=>2.34745829678957}, {:lat=>48.8556709, :lon=>2.3459201}, {:lat=>48.858799, :lon=>2.33778}, {:lat=>48.8583121340336, :lon=>2.29448028497734}, {:lat=>48.8738256014877, :lon=>2.29502221103758}, {:lat=>48.886720769013, :lon=>2.3430021056794}, {:lat=>48.8597984, :lon=>2.3408899}, {:lat=>48.8570755667268, :lon=>2.34135228261721}, {:lat=>48.865886, :lon=>2.321895}, {:lat=>48.8570190952852, :lon=>2.34736043081057}, {:lat=>48.863949, :lon=>2.313589}, {:lat=>48.8568, :lon=>2.35106}, {:lat=>48.833912, :lon=>2.332454}, {:lat=>48.8656111005854, :lon=>2.34700798988342}, {:lat=>48.884629078698, :lon=>2.33875765070958}, {:lat=>48.855748, :lon=>2.312578}, {:lat=>48.845594, :lon=>2.373304}, {:lat=>48.841136656188, :lon=>2.39657923579216}]

@visited = []
@total = 0
@threshold = 160
@groups = []
@adjMatrix = [].tap { |m| (@nodes.length+1).times { m << Array.new(@nodes.length+1) } }
def output(arr)
  arr.each do |val|

    puts val.nil? ? "" : val[:lat].to_s + ", " + val[:lon].to_s
  end
  puts "----------------------------"
end
def create_adjacency_matrix

  for i in 0 .. @nodes.length
    for j in 0 .. @nodes.length
      @adjMatrix[i][j] = 0
    end
  end
  adjacency_matrix = [].tap { |m| @nodes.length.times { m << Array.new(@nodes.length) } }
  idx1 = 0
  @nodes.each do |one|
    idx2 = 0
    @nodes.each do |two|
      if idx1 == idx2
        break
      end
      dlon = two[:lon] - one[:lon]
      dlat = two[:lat] - one[:lat]
      a = (Math.sin(dlat/2))**2 + Math.cos(one[:lat]) * Math.cos(two[:lat]) * (Math.sin(dlon/2))**2
      c = 2 * Math.atan2( Math.sqrt(a), Math.sqrt(1-a) )
      d = 6371 * c
      adjacency_matrix[idx1][idx2] = d
      adjacency_matrix[idx2][idx1] = d
      idx2+=1
    end
    idx1+=1
  end
  adjacency_matrix
end

def find_cheapest_edge(adjacency_matrix, nodes_spanned_so_far, number_of_nodes)
  available_nodes = (0..number_of_nodes-1).to_a.reject { |node_index| nodes_spanned_so_far.include?(node_index + 1) }

  cheapest_edges = available_nodes.inject([]) do |acc, node_index|
    get_edges(adjacency_matrix, node_index).select { |_, other_node_index| nodes_spanned_so_far.include?(other_node_index + 1) }.each do |weight, other_node_index|
      acc << { :start => node_index + 1, :end => other_node_index + 1, :weight => weight }
    end
    acc
  end

  cheapest_edges.sort { |x,y| x[:weight] <=> y[:weight] }.first
end
def dfs(loc, group, parent)
  if @visited.include?(loc)
    return
  end
  if loc != 0
    @visited.push(loc)
  end
  #puts parent.to_s + " -> " + loc.to_s
  for i in 0 .. @nodes.length
    if @adjMatrix[loc][i] != 0 && i != parent && i != loc && i != 0 && !@visited.include?(i)
      if @total < @threshold
        @total += @adjMatrix[loc][i]
        if(!@nodes[i].nil?)
          @groups[group].push({:lat => @nodes[i][:lat], :lon => @nodes[i][:lon]})
          @nodes[i][:lat] = "shoot";
          dfs(i, group, loc)
        end
      end
    end
  end
  if @total >= @threshold && loc != 0
    for i in 0 .. @nodes.length
      if @adjMatrix[loc][i] != 0 && i != parent && i != loc && i != 0 && !@visited.include?(i)
        #puts i.to_s + ":" + loc.to_s + " -> " + parent.to_s
        @adjMatrix[parent][i] = @adjMatrix[loc][i] + @adjMatrix[parent][loc];
        @adjMatrix[i][parent] = @adjMatrix[loc][i] + @adjMatrix[parent][loc];
        @adjMatrix[loc][i] = 0;
        @adjMatrix[i][loc] = 0;
      end
    end
  end


end
def get_edges(adjacency_matrix, node_index)
  adjacency_matrix[node_index].each_with_index.reject { |edge, index| edge.nil? }
end

def select_first_edge(adjacency_matrix)
  starting_node = 0
  cheapest_edges = get_edges(adjacency_matrix, 0).inject([]) do |all_edges, (edge, index)|
    all_edges << { :start => starting_node, :end => index, :weight => edge }
    all_edges
  end
  cheapest_edges.sort { |x,y| x[:weight] <=> y[:weight] }.first
end

def nodes_left_to_cover
  (1..@nodes.length).to_a - @nodes_spanned_so_far
end

# Prim's algorithm

output (@nodes);

@i = 0
while @nodes.length > 1 do
  adjacency_matrix = create_adjacency_matrix
  first_edge = select_first_edge(adjacency_matrix)
  @nodes_spanned_so_far, @edges = [first_edge[:start], first_edge[:end]], [first_edge]
  @adjMatrix [first_edge[:end]][first_edge[:start]] = first_edge[:weight]
  @adjMatrix [first_edge[:start]][first_edge[:end]] = first_edge[:weight]
  while !nodes_left_to_cover.empty?
    cheapest_edge = find_cheapest_edge(adjacency_matrix, @nodes_spanned_so_far, @nodes.length)
    @adjMatrix [cheapest_edge[:start]][cheapest_edge[:end]] = cheapest_edge[:weight]
    @adjMatrix [cheapest_edge[:end]][cheapest_edge[:start]] = cheapest_edge[:weight]
    @nodes_spanned_so_far << cheapest_edge[:start]
  end
  @total = 0
  @groups[@i] = []
  dfs(0, @i, 0)
  @i+=1
  @visited.clear
    @nodes.delete_if { |x| x[:lat] == "shoot" }
end
@groups.each do |val|

  output(val)
end
